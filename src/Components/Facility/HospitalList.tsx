/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, navigate, useQueryParams } from "raviger";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { statusType, useAbortableEffect } from "../../Common/utils";

import {
  DOWNLOAD_TYPES,
  FACILITY_TYPES,
  KASP_STRING,
} from "../../Common/constants";
import {
  getPermittedFacilities,
  downloadFacility,
  downloadFacilityCapacity,
  downloadFacilityDoctors,
  downloadFacilityTriage,
  getState,
  getDistrict,
  getLocalBody,
  sendNotificationMessages,
} from "../../Redux/actions";
import loadable from "@loadable/component";
import { SelectField } from "../Common/HelperInputFields";
import { InputLabel, TextField } from "@material-ui/core";
import Pagination from "../Common/Pagination";
import { FacilityModel } from "./models";
import { InputSearchBox } from "../Common/SearchBox";
import { CSVLink } from "react-csv";
import moment from "moment";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import CircularProgress from "@material-ui/core/CircularProgress";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { make as SlideOver } from "../Common/SlideOver.gen";
import FacillityFilter from "./FacilityFilter";
import { useTranslation } from "react-i18next";
import * as Notification from "../../Utils/Notifications.js";
import { Modal } from "@material-ui/core";
const Loading = loadable(() => import("../Common/Loading"));
const PageTitle = loadable(() => import("../Common/PageTitle"));

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      // "grid-column": "span 4 / span 4",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
    },
  })
);
const now = moment().format("DD-MM-YYYY:hh:mm:ss");

export const HospitalList = (props: any) => {
  const [qParams, setQueryParams] = useQueryParams();
  const classes = useStyles();
  const dispatchAction: any = useDispatch();
  const [data, setData] = useState<Array<FacilityModel>>([]);
  let manageFacilities: any = null;
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const [DownloadFile, setDownloadFile] = useState("");
  const [capacityDownloadFile, setCapacityDownloadFile] = useState("");
  const [doctorsDownloadFile, setDoctorsDownloadFile] = useState("");
  const [triageDownloadFile, setTriageDownloadFile] = useState("");
  const downloadTypes = [...DOWNLOAD_TYPES];
  const [downloadSelect, setdownloadSelect] = useState("Facility List");
  const [showFilters, setShowFilters] = useState(false);
  const [stateName, setStateName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [localbodyName, setLocalbodyName] = useState("");
  const rootState: any = useSelector((rootState) => rootState);
  const { currentUser } = rootState;
  const userType = currentUser.data.user_type;
  const [notifyMessage, setNotifyMessage] = useState("");
  const [modalFor, setModalFor] = useState(undefined);
  // state to change download button to loading while file is not ready
  const [downloadLoading, setDownloadLoading] = useState(false);
  const { t } = useTranslation();
  const limit = 14;

  const fetchData = useCallback(
    async (status: statusType) => {
      setIsLoading(true);
      const params = qParams.search
        ? {
            limit,
            offset,
            search_text: qParams.search,
            state: qParams.state,
            district: qParams.district,
            local_body: qParams.local_body,
            facility_type: qParams.facility_type,
            kasp_empanelled: qParams.kasp_empanelled,
          }
        : {
            limit,
            offset,
            state: qParams.state,
            district: qParams.district,
            local_body: qParams.local_body,
            facility_type: qParams.facility_type,
            kasp_empanelled: qParams.kasp_empanelled,
          };

      const res = await dispatchAction(getPermittedFacilities(params));
      if (!status.aborted) {
        if (res && res.data) {
          setData(res.data.results);
          setTotalCount(res.data.count);
        }
        setIsLoading(false);
      }
    },
    [
      dispatchAction,
      offset,
      qParams.search,
      qParams.kasp_empanelled,
      qParams.state,
      qParams.district,
      qParams.local_body,
      qParams.facility_type,
    ]
  );

  useAbortableEffect(
    (status: statusType) => {
      fetchData(status);
    },
    [fetchData]
  );

  const fetchStateName = useCallback(
    async (status: statusType) => {
      const res =
        Number(qParams.state) &&
        (await dispatchAction(getState(qParams.state)));
      if (!status.aborted) {
        setStateName(res?.data?.name);
      }
    },
    [dispatchAction, qParams.state]
  );

  useAbortableEffect(
    (status: statusType) => {
      fetchStateName(status);
    },
    [fetchStateName]
  );

  const fetchDistrictName = useCallback(
    async (status: statusType) => {
      const res =
        Number(qParams.district) &&
        (await dispatchAction(getDistrict(qParams.district)));
      if (!status.aborted) {
        setDistrictName(res?.data?.name);
      }
    },
    [dispatchAction, qParams.district]
  );

  useAbortableEffect(
    (status: statusType) => {
      fetchDistrictName(status);
    },
    [fetchDistrictName]
  );

  const fetchLocalbodyName = useCallback(
    async (status: statusType) => {
      const res =
        Number(qParams.local_body) &&
        (await dispatchAction(getLocalBody({ id: qParams.local_body })));
      if (!status.aborted) {
        setLocalbodyName(res?.data?.name);
      }
    },
    [dispatchAction, qParams.local_body]
  );

  useAbortableEffect(
    (status: statusType) => {
      fetchLocalbodyName(status);
    },
    [fetchLocalbodyName]
  );

  const findFacilityTypeById = (id: number) => {
    const facility_type = FACILITY_TYPES.find((type) => type.id == id);
    return facility_type?.text;
  };

  const onSearchSuspects = (search: string) => {
    if (search !== "") setQueryParams({ search }, true);
    else setQueryParams({ search: "" }, true);
  };

  const handleDownload = async () => {
    // while is getting ready
    setDownloadLoading(true);
    const res = await dispatchAction(downloadFacility());
    // file ready to download
    setDownloadLoading(false);
    setDownloadFile(res.data);
    document.getElementById("facilityDownloader")?.click();
  };

  const handleCapacityDownload = async () => {
    // while is getting ready
    setDownloadLoading(true);
    const cap = await dispatchAction(downloadFacilityCapacity());
    // file ready to download
    setDownloadLoading(false);
    setCapacityDownloadFile(cap.data);
    document.getElementById("capacityDownloader")?.click();
  };

  const handleDoctorsDownload = async () => {
    // while is getting ready
    setDownloadLoading(true);
    const doc = await dispatchAction(downloadFacilityDoctors());
    // file ready to download
    setDownloadLoading(false);
    setDoctorsDownloadFile(doc.data);
    document.getElementById("doctorsDownloader")?.click();
  };

  const handleTriageDownload = async () => {
    // while is getting ready
    setDownloadLoading(true);
    const tri = await dispatchAction(downloadFacilityTriage());
    // file ready to download
    setDownloadLoading(false);
    setTriageDownloadFile(tri.data);
    document.getElementById("triageDownloader")?.click();
  };

  const updateQuery = (params: any) => {
    const nParams = Object.assign({}, qParams, params);
    setQueryParams(nParams, true);
  };

  const applyFilter = (data: any) => {
    const filter = { ...qParams, ...data };
    updateQuery(filter);
    setShowFilters(false);
  };

  const removeFilter = (paramKey: any) => {
    updateQuery({
      ...qParams,
      [paramKey]: "",
    });
  };

  const hasFiltersApplied = (qParams: any) => {
    return (
      qParams.state ||
      qParams.district ||
      qParams.local_body ||
      qParams.facility_type ||
      qParams.kasp_empanelled ||
      qParams?.search
    );
  };

  const badge = (key: string, value: any, paramKey: string) => {
    return (
      value && (
        <span className="inline-flex h-full items-center px-3 py-1 rounded-full text-xs font-medium leading-4 bg-white text-gray-600 border">
          {t(key)}
          {": "}
          {value}
          <i
            className="fas fa-times ml-2 rounded-full cursor-pointer hover:bg-gray-500 px-1 py-0.5"
            onClick={(e) => removeFilter(paramKey)}
          ></i>
        </span>
      )
    );
  };

  const handleDownloader = () => {
    switch (downloadSelect) {
      case "Facility List":
        handleDownload();
        break;
      case "Facility Capacity List":
        handleCapacityDownload();
        break;
      case "Facility Doctors List":
        handleDoctorsDownload();
        break;
      case "Facility Triage Data":
        handleTriageDownload();
        break;
    }
  };

  const handlePagination = (page: number, limit: number) => {
    const offset = (page - 1) * limit;
    setCurrentPage(page);
    setOffset(offset);
  };

  const handleNotifySubmit = async (id: any) => {
    const data = {
      facility: id,
      message: notifyMessage,
    };
    if (data.message.trim().length >= 1) {
      const res = await dispatchAction(sendNotificationMessages(data));
      if (res && res.status == 204) {
        Notification.Success({
          msg: "Facility Notified",
        });
        setModalFor(undefined);
      } else {
        Notification.Error({ msg: "Something went wrong..." });
      }
    } else {
      Notification.Error({
        msg: "Notification should contain atleast 1 character.",
      });
    }
  };

  const kaspOptionValues = [
    { id: "", text: "Not Selected" },
    { id: "true", text: "Yes" },
    { id: "false", text: "No" },
  ];

  let facilityList: any[] = [];
  if (data && data.length) {
    facilityList = data.map((facility: any, idx: number) => {
      return (
        <div key={`usr_${facility.id}`} className="w-full">
          <div className="block rounded-lg bg-white shadow h-full hover:border-primary-500 overflow-hidden">
            <div className="flex h-full">
              <div className="md:flex hidden w-1/4 self-stretch shrink-0 bg-gray-300 items-center justify-center">
                {facility.cover_image_url ? (
                  <img
                    src={facility.cover_image_url}
                    alt="Facility"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className="fas fa-hospital text-4xl block text-gray-600"></i>
                )}
              </div>
              <div className="h-full w-full grow overflow-clip">
                <div className="h-full flex flex-col justify-between w-full">
                  <div className="pl-4 md:pl-2 pr-4 py-2 w-full ">
                    <div className="flow-root">
                      {facility.kasp_empanelled && (
                        <div className="float-right mt-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium leading-5 bg-yellow-100 text-yellow-800">
                          {KASP_STRING}
                        </div>
                      )}
                      <div className="float-left font-black text-xl capitalize">
                        {facility.name}
                      </div>
                    </div>

                    <div className="block">
                      <div className="inline-flex items-center px-2.5 py-0.5 mt-2 rounded-md text-sm font-medium leading-5 bg-blue-100 text-blue-800">
                        {facility.facility_type}
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <div className="flex flex-col">
                        <div className="font-semibold">
                          {facility.local_body_object?.name}
                        </div>
                      </div>
                    </div>
                    <a
                      href={`tel:${facility.phone_number}`}
                      className="font-semibold"
                    >
                      {facility.phone_number || "-"}
                    </a>
                  </div>
                  <div className="bg-gray-50 border-t px-2 md:px-6 py-2 flex-none">
                    <div className="flex py-4 justify-between">
                      <div className="flex justify-between w-full flex-wrap gap-2">
                        <div>
                          {userType !== "Staff" ? (
                            <button
                              className="mx-2 md:ml-0 inline-flex items-center px-3 py-2 border border-primary-500 text-sm leading-4 font-medium rounded-md text-primary-700 bg-white hover:text-primary-500 focus:outline-none focus:border-primary-300 focus:ring-blue active:text-primary-800 active:bg-gray-50 transition ease-in-out duration-150 hover:shadow"
                              onClick={(_) => setModalFor(facility.id)}
                            >
                              <i className="far fa-comment-dots mr-0 md:mr-1"></i>{" "}
                              <span className="md:block hidden">Notify</span>
                            </button>
                          ) : (
                            <></>
                          )}
                          <Modal
                            open={modalFor === facility.id}
                            onClose={(_) => setModalFor(undefined)}
                            aria-labelledby="Notify This Facility"
                            aria-describedby="Type a message and notify this facility"
                            className=""
                          >
                            <div className="h-screen w-full absolute flex items-center justify-center bg-modal">
                              <form
                                onSubmit={(event: any) => {
                                  event.preventDefault();
                                  handleNotifySubmit(modalFor);
                                }}
                                className="bg-white rounded shadow p-8 m-4 max-h-full text-center flex flex-col max-w-lg w-2/3 min-w-max-content"
                              >
                                <div className="mb-4">
                                  <h1 className="text-2xl">
                                    Notify: {facility.name}
                                  </h1>
                                </div>
                                <div>
                                  <TextField
                                    id="NotifyModalMessageInput"
                                    rows={6}
                                    multiline
                                    required
                                    className="w-full border p-2 max-h-64"
                                    onChange={(e) =>
                                      setNotifyMessage(e.target.value)
                                    }
                                    placeholder="Type your message..."
                                    variant="outlined"
                                  />
                                </div>
                                <div className="flex flex-row justify-end">
                                  <button
                                    type="button"
                                    className="btn-danger btn mt-4 mr-2 w-full md:w-auto"
                                    onClick={(_) => setModalFor(undefined)}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="btn-primary btn mt-4 mr-2 w-full md:w-auto"
                                  >
                                    Send Notification
                                  </button>
                                </div>
                              </form>
                            </div>
                          </Modal>
                        </div>
                        <div className="flex gap-2 ">
                          <Link
                            href={`/facility/${facility.id}`}
                            className="inline-flex items-center px-3 py-2 border border-primary-500 text-sm leading-4 font-medium rounded-md text-primary-700 bg-white hover:text-primary-500 focus:outline-none focus:border-primary-300 focus:ring-blue active:text-primary-800 active:bg-gray-50 transition ease-in-out duration-150 hover:shadow"
                          >
                            <i className="fas fa-hospital mr-2 text-primary-500"></i>
                            {t("Facility")}
                          </Link>
                          <Link
                            href={`/facility/${facility.id}/patients`}
                            className=" inline-flex items-center px-3 py-2 border border-primary-500 text-sm leading-4 font-medium rounded-md text-primary-700 bg-white hover:text-primary-500 focus:outline-none focus:border-primary-300 focus:ring-blue active:text-primary-800 active:bg-gray-50 transition ease-in-out duration-150 hover:shadow"
                          >
                            <i className="fas fa-user-injured text-primary-500 mr-2"></i>
                            {t("Patients")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  if (isLoading || !data) {
    manageFacilities = <Loading />;
  } else if (data && data.length) {
    manageFacilities = (
      <>
        <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
          {facilityList}
        </div>
        {totalCount > limit && (
          <div className="mt-4 flex w-full justify-center">
            <Pagination
              cPage={currentPage}
              defaultPerPage={limit}
              data={{ totalCount }}
              onChange={handlePagination}
            />
          </div>
        )}
      </>
    );
  } else if (data && data.length === 0) {
    manageFacilities = hasFiltersApplied(qParams) ? (
      <div className="w-full">
        <div className="text-3xl mt-4">{t("no_facilities")}</div>
      </div>
    ) : (
      <div>
        <div
          className="p-16 mt-4 bg-white shadow rounded-md border border-grey-500 whitespace-nowrap text-sm font-semibold cursor-pointer hover:bg-gray-300 text-center"
          onClick={() => navigate("/facility/create")}
        >
          <i className="fas fa-plus text-3xl"></i>
          <div className="mt-2 text-xl">{t("create_facility")}</div>
          <div className="text-xs mt-1 text-red-700">
            {t("no_duplicate_facility")}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6">
      <div className="grid grid-cols-2">
        <PageTitle
          title={t("Facilities")}
          hideBack={true}
          className="mx-3"
          breadcrumbs={false}
        />

        <div className="flex justify-end w-full mt-4">
          <div>
            <Accordion className="mt-10 lg:mt-0 md:mt-0 sm:mt-0">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  {t("downloads")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <InputLabel className="text-sm">
                    {t("download_type")}
                  </InputLabel>
                  <div className="flex flex-row">
                    <SelectField
                      name="select_download"
                      className="text-sm"
                      variant="outlined"
                      margin="dense"
                      optionArray={true}
                      value={downloadSelect}
                      options={downloadTypes}
                      onChange={(e) => {
                        setdownloadSelect(e.target.value);
                      }}
                    />

                    {downloadLoading ? (
                      <div className="px-2 ml-2 my-2 pt-1 rounded">
                        <CircularProgress className="text-primary-600 w-6 h-6" />
                      </div>
                    ) : (
                      <button
                        className="bg-primary-600 hover:shadow-md px-2 ml-2 my-2  rounded"
                        onClick={handleDownloader}
                        disabled={downloadLoading}
                      >
                        <svg
                          className="h-6 w-6"
                          viewBox="0 0 16 16"
                          fill="white"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M.5 8a.5.5 0 0 1 .5.5V12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5a.5.5 0 0 1 1 0V12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8.5A.5.5 0 0 1 .5 8z"
                          />
                          <path
                            fillRule="evenodd"
                            d="M5 7.5a.5.5 0 0 1 .707 0L8 9.793 10.293 7.5a.5.5 0 1 1 .707.707l-2.646 2.647a.5.5 0 0 1-.708 0L5 8.207A.5.5 0 0 1 5 7.5z"
                          />
                          <path
                            fillRule="evenodd"
                            d="M8 1a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0v-8A.5.5 0 0 1 8 1z"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                <div className="hidden">
                  <CSVLink
                    data={DownloadFile}
                    filename={`facilities-${now}.csv`}
                    target="_blank"
                    className="hidden"
                    id="facilityDownloader"
                  ></CSVLink>
                  <CSVLink
                    data={capacityDownloadFile}
                    filename={`facility-capacity-${now}.csv`}
                    className="hidden"
                    id="capacityDownloader"
                    target="_blank"
                  ></CSVLink>
                  <CSVLink
                    data={doctorsDownloadFile}
                    filename={`facility-doctors-${now}.csv`}
                    target="_blank"
                    className="hidden"
                    id="doctorsDownloader"
                  ></CSVLink>
                  <CSVLink
                    data={triageDownloadFile}
                    filename={`facility-triage-${now}.csv`}
                    target="_blank"
                    className="hidden"
                    id="triageDownloader"
                  ></CSVLink>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
      <div className="lg:flex gap-2 mt-4">
        <div className="bg-white overflow-hidden shadow rounded-lg md:mr-2 min-w-fit flex-1">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm leading-5 font-medium text-gray-500 truncate">
                Total Facilities
              </dt>
              {/* Show spinner until cound is fetched from server */}
              {isLoading ? (
                <dd className="mt-4 text-5xl leading-9">
                  <CircularProgress className="text-primary-500" />
                </dd>
              ) : (
                <dd className="mt-4 text-5xl leading-9 font-semibold text-gray-900">
                  {totalCount}
                </dd>
              )}
            </dl>
          </div>
        </div>
        <div className="flex my-4 gap-2 flex-wrap justify-between flex-grow">
          <div className="w-72">
            <InputSearchBox
              value={qParams.search}
              search={onSearchSuspects}
              placeholder={t("facility_search_placeholder")}
              errors=""
            />
          </div>

          <div className="flex">
            <div>
              <div className="flex items-start mb-2">
                <button
                  className="btn btn-primary-ghost"
                  onClick={() => setShowFilters(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="fill-current w-4 h-4 mr-2"
                  >
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12">
                      {" "}
                    </line>
                    <line x1="8" y1="18" x2="21" y2="18">
                      {" "}
                    </line>
                    <line x1="3" y1="6" x2="3.01" y2="6">
                      {" "}
                    </line>
                    <line x1="3" y1="12" x2="3.01" y2="12">
                      {" "}
                    </line>
                    <line x1="3" y1="18" x2="3.01" y2="18">
                      {" "}
                    </line>
                  </svg>
                  <span>{t("advanced_filters")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <SlideOver show={showFilters} setShow={setShowFilters}>
          <div className="bg-white min-h-screen p-4">
            <FacillityFilter
              filter={qParams}
              onChange={applyFilter}
              closeFilter={() => setShowFilters(false)}
            />
          </div>
        </SlideOver>
      </div>
      <div className="flex items-center space-x-2 my-2 flex-wrap w-full col-span-3">
        {badge("Facility/District Name", qParams.search, "search")}
        {badge("State", stateName, "state")}
        {badge("District", districtName, "district")}
        {badge("Local Body", localbodyName, "local_body")}
        {badge(
          "Facility Type",
          findFacilityTypeById(qParams.facility_type),
          "facility_type"
        )}
        {qParams.kasp_empanelled &&
          badge(
            `${KASP_STRING} Empanelled`,
            qParams.kasp_empanelled === "true"
              ? KASP_STRING
              : `Non ${KASP_STRING}`,
            "kasp_empanelled"
          )}
      </div>
      <div className="mt-4 pb-24">
        <div>{manageFacilities}</div>
      </div>
    </div>
  );
};
