import { useQueryParams } from "raviger";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GenericFilterBadge from "../../CAREUI/display/FilterBadge";
import PaginationComponent from "../../Components/Common/Pagination";
import useConfig from "./useConfig";
import { classNames } from "../../Utils/utils";

export type FilterState = Record<string, unknown>;
export type FilterParamKeys = string | string[];
interface FilterBadgeProps {
  name: string;
  value?: string;
  paramKey: FilterParamKeys;
}

/**
 * A custom hook wrapped around raviger's `useQueryParams` hook to ease handling
 * of pagination and filters.
 */
export default function useFilters({ limit = 14 }: { limit?: number }) {
  const { t } = useTranslation();
  const { kasp_string } = useConfig();
  const hasPagination = limit > 0;
  const [showFilters, setShowFilters] = useState(false);
  const [qParams, setQueryParams] = useQueryParams();

  const updateQuery = (filter: FilterState) => {
    filter = hasPagination ? { page: 1, limit, ...filter } : filter;
    setQueryParams(Object.assign({}, qParams, filter), { replace: true });
  };
  const updatePage = (page: number) => {
    if (!hasPagination) return;
    setQueryParams(Object.assign({}, qParams, { page }), { replace: true });
  };
  const removeFilters = (params: string[]) => {
    setQueryParams(removeFromQuery(qParams, params));
  };
  const removeFilter = (param: string) => removeFilters([param]);

  useEffect(() => updateFiltersCache(qParams), [qParams]);

  useEffect(() => {
    const cache = getFiltersCache();
    const qParamKeys = Object.keys(qParams);
    const canSkip = Object.keys(cache).every(
      (key) => qParamKeys.includes(key) && qParams[key] === cache[key]
    );
    if (canSkip) return;
    if (Object.keys(cache).length) {
      setQueryParams(cache);
    }
  }, []);

  const FilterBadge = ({ name, value, paramKey }: FilterBadgeProps) => {
    if (Array.isArray(paramKey))
      return (
        <GenericFilterBadge
          key={name}
          name={name}
          value={
            value === undefined
              ? paramKey
                  .map((k) => qParams[k])
                  .filter(Boolean)
                  .join(", ")
              : value
          }
          onRemove={() => removeFilters(paramKey)}
        />
      );
    return (
      <GenericFilterBadge
        name={name}
        value={value === undefined ? qParams[paramKey] : value}
        onRemove={() => removeFilter(paramKey)}
      />
    );
  };

  const badgeUtils = {
    badge(name: string, paramKey: FilterParamKeys) {
      return { name, paramKey };
    },
    ordering(name = "Sort by", paramKey = "ordering") {
      return {
        name,
        paramKey,
        value: qParams[paramKey] && t("SortOptions." + qParams[paramKey]),
      };
    },
    value(name: string, paramKey: FilterParamKeys, value: string) {
      return { name, value, paramKey };
    },
    phoneNumber(name = "Phone Number", paramKey = "phone_number") {
      return { name, value: qParams[paramKey] as string, paramKey };
    },
    range(name: string, paramKey: string, minKey = "min", maxKey = "max") {
      const paramKeys = [paramKey + "_" + minKey, paramKey + "_" + maxKey];
      const values = [qParams[paramKeys[0]], qParams[paramKeys[1]]];
      if (values[0] === values[1])
        return [{ name, value: values[0], paramKey: paramKeys }];
      return [name + " " + minKey, name + " " + maxKey].map((name, i) => {
        return { name, value: values[i], paramKey: paramKeys[i] };
      });
    },
    dateRange(name = "Date", paramKey = "date") {
      return badgeUtils.range(name, paramKey, "after", "before");
    },
    boolean(
      name: string,
      paramKey: string,
      options?: {
        trueLabel?: string;
        falseLabel?: string;
        trueValue?: string;
        falseValue?: string;
      }
    ) {
      const {
        trueLabel = "Yes",
        falseLabel = "No",
        trueValue = "true",
        falseValue = "false",
      } = options || {};

      const value =
        (qParams[paramKey] === trueValue && trueLabel) ||
        (qParams[paramKey] === falseValue && falseLabel) ||
        "";
      return { name, value, paramKey };
    },
    kasp(nameSuffix = "", paramKey = "is_kasp") {
      const name = nameSuffix ? kasp_string + " " + nameSuffix : kasp_string;
      const [trueLabel, falseLabel] = [kasp_string, "Non " + kasp_string];
      return badgeUtils.boolean(name, paramKey, { trueLabel, falseLabel });
    },
  };

  const FilterBadges = ({
    badges,
    children,
  }: {
    badges: (utils: typeof badgeUtils) => FilterBadgeProps[];
    children?: React.ReactNode;
  }) => {
    const compiledBadges = badges(badgeUtils);
    const { t } = useTranslation();

    const activeFilters = compiledBadges.reduce((acc, badge) => {
      const { paramKey } = badge;

      if (Array.isArray(paramKey)) {
        const active = paramKey.filter((key) => qParams[key]);
        if (active) acc.concat(active);
      } else {
        if (qParams[paramKey]) acc.push(paramKey);
      }

      return acc;
    }, [] as string[]);

    return (
      <div className="col-span-3 my-2 flex w-full flex-wrap items-center gap-2">
        {compiledBadges.map((props) => (
          <FilterBadge {...props} name={t(props.name)} key={props.name} />
        ))}
        {activeFilters.length >= 1 && (
          <button
            id="clear-all-filters"
            className="rounded-full border border-gray-300 bg-white px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
            onClick={() => {
              updateFiltersCache({});
              removeFilters(Object.keys(qParams));
            }}
          >
            {t("clear_all_filters")}
          </button>
        )}
        {children}
      </div>
    );
  };

  const Pagination = ({
    totalCount,
    noMargin,
  }: {
    totalCount: number;
    noMargin?: boolean;
  }) => {
    if (!hasPagination) {
      const errorMsg = "Do not render Pagination component, when limit is <= 0";
      return <span className="bg-red-500 text-white">{errorMsg}</span>;
    }
    return (
      <div
        className={classNames(
          "flex w-full justify-center",
          totalCount > limit ? "visible" : "invisible",
          !noMargin && "mt-4"
        )}
      >
        <PaginationComponent
          cPage={qParams.page}
          defaultPerPage={limit}
          data={{ totalCount }}
          onChange={(page) => updatePage(page)}
        />
      </div>
    );
  };

  return {
    qParams,
    resultsPerPage: limit,
    /**
     * Updates the query params and resets to page 1.
     * To prevent reset to page 1, pass the `page` property along with the obj.
     */
    updateQuery,
    /** Temp. alias of `updateQuery` until the new Filters slideover. Do not use. */
    applyFilter: updateQuery,
    /** Updates the query params with the specified page. */
    updatePage,
    /**
     * Removes the filter from query param
     * @param param is the key of the filter to be removed.
     */
    removeFilter,

    /**
     * Removes multiple filters from query param
     * @param params is the list of keys to be removed.
     */
    removeFilters,
    FilterBadge,
    FilterBadges,
    Pagination,

    advancedFilter: {
      show: showFilters,
      setShow: setShowFilters,
      filter: qParams,
      removeFilters,
      onChange: (filter: FilterState) => {
        updateQuery(filter);
        setShowFilters(false);
      },
      closeFilter: () => setShowFilters(false),
    },
  };
}

const removeFromQuery = (query: Record<string, unknown>, params: string[]) => {
  const result = { ...query };
  for (const param of params) {
    delete result[param];
  }
  return result;
};

const FILTERS_CACHE_BLACKLIST = ["page", "limit", "offset"];

const getFiltersCacheKey = () => `filters--${window.location.pathname}`;
const getFiltersCache = () => {
  return JSON.parse(localStorage.getItem(getFiltersCacheKey()) || "{}");
};
const updateFiltersCache = (cache: Record<string, unknown>) => {
  const result = { ...cache };
  for (const param of FILTERS_CACHE_BLACKLIST) {
    delete result[param];
  }
  localStorage.setItem(getFiltersCacheKey(), JSON.stringify(result));
};
