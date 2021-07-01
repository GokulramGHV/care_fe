
let str = React.string

let loc_options :array<Options.t> = [
    {
        name: "loc",
        value: "alert",
        label: "Alert",
    },
    {
        name: "loc",
        value: "drowsy",
        label: "Drowsy",
    },
    {
        name: "loc",
        value: "stuporous",
        label: "Stuporous",
    },
    {
        name: "loc",
        value: "comatose",
        label: "Comatose",
    },
    {
        name: "loc",
        value: "cannot_be_assessed",
        label: "Cannot be assessed",
    }

]


let reaction_options :array<Options.t> = [
    {
        name: "reaction",
        value: "brisk",
        label: "Brisk",
    },
    {
        name: "reaction",
        value: "sluggish",
        label: "Sluggish",
    },
    {
        name: "reaction",
        value: "fixed",
        label: "Fixed",
    },
    {
        name: "reaction",
        value: "cannot_be_assessed",
        label: "Cannot be assessed",
    }

]
let glascow_title_val = [
    "eye_open",
    "verbal_response",
    "motor_response"
]

let glassgowComaScale :Options.glassgow_coma_scale = [
    {
        title: "Eye Open",
        title_value: glascow_title_val[0],
        options: [
            {
                name: glascow_title_val[0],
                value: "4",
                label: "4 - Spontaneous",
            },
            {
                name: glascow_title_val[0],
                value: "3",
                label: "3 - To Speech",
            },
            {
                name: glascow_title_val[0],
                value: "2",
                label: "2 - To Pain",
            },
            {
                name: glascow_title_val[0],
                value: "1",
                label: "1 - None",
            }
        ]
    },
    {
        title: "Verbal Response",
        title_value: glascow_title_val[1],
        options: [
            {
                name: glascow_title_val[1],
                value: "5",
                label: "5 - Oriented/Coos/Babbies",
            },
            {
                name: glascow_title_val[1],
                value: "4",
                label: "4 - Confused/Irritable",
            },
            {
                name: glascow_title_val[1],
                value: "3",
                label: "3 - Inappropriate words/Cry to pain",
            },
            {
                name: glascow_title_val[1],
                value: "2",
                label: "2 - Incomprehensible words/Moans to pain",
            },
            {
                name: glascow_title_val[1],
                value: "1",
                label: "1 - None",
            }
        ]
    },
    {
        title: "Motor Response",
        title_value: glascow_title_val[2],
        options: [
            {
                name: glascow_title_val[2],
                value: "6",
                label: "6 - Obeying/Normal Activity",
            },
            {
                name: glascow_title_val[2],
                value: "5",
                label: "5 - Localizing/Withdrawl to touch",
            },
            {
                name: glascow_title_val[2],
                value: "4",
                label: "4 - Withdrawing",
            },
            {
                name: glascow_title_val[2],
                value: "3",
                label: "3 - Abnormal Flexion",
            },
            {
                name: glascow_title_val[2],
                value: "2",
                label: "2 - Incomprehensible words/Moans to pain",
            },
            {
                name: glascow_title_val[2],
                value: "1",
                label: "1 - None",
            }
        ]
    }
]

let limps = ["Upper Extremity-Right", "Upper Extremity-Left", "Lower Extremity-Right", "Lower Extremity-Left"]
let limps_title_val = [
    "upper_extremity_right",
    "upper_extremity_left",
    "lower_extremity_right",
    "lower_extremity_left"
]

let limp_options : Options.limp_options = [
    {
        title: "Upper Extremity-Right",
        title_value: limps_title_val[0],
        options: [
            {
        name: limps_title_val[0],
        value: "strong",
        label: "Strong",
    },
    {
        name: limps_title_val[0],
        value: "moderate",
        label: "Moderate",
    },
    {
        name: limps_title_val[0],
        value: "weak",
        label: "Weak",
    },
    {
        name: limps_title_val[0],
        value: "flexion",
        label: "Flexion",
    },
    {
        name: limps_title_val[0],
        value: "extension",
        label: "Extension",
    },
    {
        name: limps_title_val[0],
        value: "none",
        label: "None",
    }
        ]
    },
    {
        title: "Upper Extremity-Left",
        title_value: limps_title_val[1],
        options: [
            {
        name: limps_title_val[1],
        value: "strong",
        label: "Strong",
    },
    {
        name: limps_title_val[1],
        value: "moderate",
        label: "Moderate",
    },
    {
        name: limps_title_val[1],
        value: "weak",
        label: "Weak",
    },
    {
        name: limps_title_val[1],
        value: "flexion",
        label: "Flexion",
    },
    {
        name: limps_title_val[1],
        value: "extension",
        label: "Extension",
    },
    {
        name: limps_title_val[1],
        value: "none",
        label: "None",
    }
        ]
    },
    {
        title: "Lower Extremity-Right",
        title_value: limps_title_val[2],
        options: [
            {
        name: limps_title_val[2],
        value: "strong",
        label: "Strong",
    },
    {
        name: limps_title_val[2],
        value: "moderate",
        label: "Moderate",
    },
    {
        name: limps_title_val[2],
        value: "weak",
        label: "Weak",
    },
    {
        name: limps_title_val[2],
        value: "flexion",
        label: "Flexion",
    },
    {
        name: limps_title_val[2],
        value: "extension",
        label: "Extension",
    },
    {
        name: limps_title_val[2],
        value: "none",
        label: "None",
    }
        ]
    },
    {
        title: "Lower Extremity-Left",
        title_value: limps_title_val[3],
        options: [
            {
        name: limps_title_val[3],
        value: "strong",
        label: "Strong",
    },
    {
        name: limps_title_val[3],
        value: "moderate",
        label: "Moderate",
    },
    {
        name: limps_title_val[3],
        value: "weak",
        label: "Weak",
    },
    {
        name: limps_title_val[3],
        value: "flexion",
        label: "Flexion",
    },
    {
        name: limps_title_val[3],
        value: "extension",
        label: "Extension",
    },
    {
        name: limps_title_val[3],
        value: "none",
        label: "None",
    }
        ]
    }
    

]

let cannot_be_assessed: array<Options.t> = [
    {
        name: "",
        value: "cannot_be_assessed",
        label: "Cannot be assessed",
    },
    ]

let handleSubmit = (handleDone, state) => {
	handleDone(state)
}

type action =
| SetLevelOfConciousness(string)
| SetLeftPupilSize(string)
| SetLeftPupilReaction(string)
| SetRightPupilSize(string)
| SetRightPupilReaction(string)
| SetEyeOpen(string)
| SetVerbalResponse(string)
| SetMotorResponse(string)
| SetTotalGlascowScale(string)
| SetUpperExtremityR(string)
| SetUpperExtremityL(string)
| SetLowerExtremityR(string)
| SetLowerExtremityL(string)


let reducer = (state, action) => {
    switch action {
        | SetLevelOfConciousness(levelOfConciousness) => {...state, NeurologicalMonitoringTypes.levelOfConciousness: levelOfConciousness}
        | SetLeftPupilSize(leftPupilSize) => {...state, NeurologicalMonitoringTypes.leftPupilSize: leftPupilSize}
        | SetLeftPupilReaction(leftPupilReaction) => {...state, NeurologicalMonitoringTypes.leftPupilReaction: leftPupilReaction}
        | SetRightPupilSize(rightPupilSize) => {...state, NeurologicalMonitoringTypes.rightPupilSize: rightPupilSize}
        | SetRightPupilReaction(rightPupilReaction) => {...state, NeurologicalMonitoringTypes.rightPupilReaction: rightPupilReaction}
        | SetEyeOpen(eyeOpen) => {...state, NeurologicalMonitoringTypes.eyeOpen: eyeOpen}
        | SetVerbalResponse(verbalResponse) => {...state, NeurologicalMonitoringTypes.verbalResponse: verbalResponse}
        | SetMotorResponse(motorResponse) => {...state, NeurologicalMonitoringTypes.motorResponse: motorResponse}
        | SetTotalGlascowScale(totalGlascowScale) => {...state, NeurologicalMonitoringTypes.totalGlascowScale: totalGlascowScale}
        | SetUpperExtremityR(upperExtremityR) => {...state, NeurologicalMonitoringTypes.upperExtremityR: upperExtremityR}
        | SetUpperExtremityL(upperExtremityL) => {...state, NeurologicalMonitoringTypes.upperExtremityL: upperExtremityL}
        | SetLowerExtremityR(lowerExtremityR) => {...state, NeurologicalMonitoringTypes.lowerExtremityR: lowerExtremityR}
        | SetLowerExtremityL(lowerExtremityL) => {...state, NeurologicalMonitoringTypes.lowerExtremityL: lowerExtremityL}
    }
}

let glascowAction = (glascow, value) => {
    switch glascow {
        | "eye_open" => SetEyeOpen(value)
        | "verbal_response" => SetVerbalResponse(value)
        | "motor_response" => SetMotorResponse(value)
        | _ => SetMotorResponse(value)
    }
}

let limpAction = (limp, value) => {
    switch limp {
        | "upper_extremity_right" => SetUpperExtremityR(value)
        | "upper_extremity_left" => SetUpperExtremityL(value)
        | "lower_extremity_right" => SetLowerExtremityR(value)
        | "lower_extremity_left" => SetLowerExtremityL(value)
        | _ => SetLowerExtremityL(value)
    }
}

let getFieldValue = (event) => {
	ReactEvent.Form.target(event)["value"]
}

@react.component
let make = (~handleDone, ~initialState) => {
    let (state, send) = React.useReducer(reducer, initialState)
    Js.log(state)
    <div>
        <CriticalCare__PageTitle title="Neurological Monitoring" />
        <div className="my-4">
// <div className="ml-36 w-8/12">
            <div className="my-10">
                <div className=" text-2xl font-bold my-2">{str("Level Of Consciousness")}</div>
                <CriticalCare__RadioButton options={loc_options} horizontal=true onChange={(event) =>  send(SetLevelOfConciousness(getFieldValue(event)))} />
            </div>
            <div className="my-10">
                <div className="text-2xl font-bold my-2 mb-4">{str("Pupil")}</div>
                <div className="text-lg font-bold my-3">{str("Left Pupil")}</div>
                <CriticalCare__PupilRangeSlider />
                // <CriticalCare__RadioButton options ={cannot_be_assessed} horizontal=true />
                <div className="my-15 mb-8">
                    <div className="font-bold my-4">{str("Reaction")}</div>
                    // <CriticalCare__RadioButton options={reaction_options} horizontal=true />
                </div>

                <div className="text-lg font-bold my-5">{str("Right Pupil")}</div>
                <CriticalCare__PupilRangeSlider />
                // <CriticalCare__RadioButton options ={cannot_be_assessed} horizontal=true />          
                <div className="my-15 mb-8">
                    <div className="font-bold my-4">{str("Reaction")}</div>
                    // <CriticalCare__RadioButton options={reaction_options} horizontal=true/>
                </div>
            </div>

            <div className="my-15 w-full h-1 bg-gray-300"></div>

            <div className="my-10">
                <div className="text-3xl font-bold">{str("Glasgow Coma Scale")}</div>
                <div>
                    {glassgowComaScale|>Array.map((x) => {
                        // let action = glascowAction(Options.title_val(x), )
                        // {Js.log(Options.options(x))}
                        // {Js.log("jhbbk")}
                    <div>
                        <div className="flex justify-between">
                            <div className="font-bold mt-8">{str(Options.title(x))}</div>
                            <div className="text-lg font-bold text-blue-500 mt-8">{str("2")}</div>
                        </div>
                        
                        <CriticalCare__RadioButton options={Options.options(x)} horizontal=false onChange={(event) =>  send(glascowAction(Options.title_value(x), getFieldValue(event)))}/>
                    </div>
                })
                |> React.array }
                </div>
                <div className="flex justify-between mt-4">
                    <div className="font-bold text-xl">{str("Total")}</div>
                    <div className="text-3xl text-blue-500 font-bold">{str("3")}</div>
                </div>
            </div>

            <div className="my-15 w-full h-1 bg-gray-300"></div>

            <div className="my-10">
                <div className="text-3xl font-bold">{str("Limp Response")}</div>
                <div>
                    {limp_options|>Array.map((x) => {
                    <>
                        <div className="font-bold mt-8 mb-1">{str(Options.title(x))}</div>
                        <CriticalCare__RadioButton options={Options.options(x)} horizontal=true onChange={(event) =>  send(limpAction(Options.title_value(x), getFieldValue(event)))}/>
                    </>
                })
                |> React.array }
                </div>
            </div>

            <div className="my-15 w-full h-1 bg-gray-300"></div>
            <button className="flex w-full bg-blue-600 text-white p-2 text-lg hover:bg-blue-800 justify-center items-center rounded-md" onClick={(_) => handleSubmit(handleDone, state)}>{str("Done")}</button>

        </div>
    </div>
}
