/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

// !!!ALL THIS METHODS IS FROM CODE-SERVER!!!

// TODO: [DH]
/* tslint:disable */

const isValidType = (type:string):boolean => {
    switch (type) {
        case "STRING":
        case "INTEGER":
        case "FLOAT":
        case "BOOLEAN":
            return true;
    }
    return false;
};

const getInputsOutputs = (code:string):{ [key:string]:any } => {

    var ret:{ [key:string]:any } = {
        digitalInputs: {},
        digitalOutputs: {},
        analogInputs: {},
        analogOutputs: {},
        messageInputs: {},
        messageOutputs: {},
    };

    var regExpAnalogIn = /ANALOG_INPUT\s*\(\s*([0-9a-zA-Z_]+)\s*,\s*{/g;
    var regExpDigitalIn = /DIGITAL_INPUT\s*\(\s*([0-9a-zA-Z_]+)\s*,\s*{/g;
    var regExpAnalogOut = /ANALOG_OUTPUT\s*\(\s*([0-9a-zA-Z_]+)\s*\)/g;
    var regExpDigitalOut = /DIGITAL_OUTPUT\s*\(\s*([0-9a-zA-Z_]+)\s*\)/g;

    // TODO: make better BYZANCE_SOMETHING parser (comments, check values, etc.)

    var regExpMessageIn = /MESSAGE_INPUT\s*\(\s*([0-9a-zA-Z_]+)\s*,(\s*([A-Za-z]+)\s*,)(\s*([A-Za-z]+)\s*,)?(\s*([A-Za-z]+)\s*,)?(\s*([A-Za-z]+)\s*,)?(\s*([A-Za-z]+)\s*,)?(\s*([A-Za-z]+)\s*,)?(\s*([A-Za-z]+)\s*,)?(\s*([A-Za-z]+)\s*,)?\s*{/g;
    var regExpMessageOut = /MESSAGE_OUTPUT\s*\(\s*([0-9a-zA-Z_]+)\s*,(\s*([A-Za-z]+)\s*[,)])(\s*([A-Za-z]+)\s*[,)])?(\s*([A-Za-z]+)\s*[,)])?(\s*([A-Za-z]+)\s*[,)])?(\s*([A-Za-z]+)\s*[,)])?(\s*([A-Za-z]+)\s*[,)])?(\s*([A-Za-z]+)\s*[,)])?(\s*([A-Za-z]+)\s*[,)])?/g;

    var rOne;

    while ((rOne = regExpAnalogIn.exec(code)) !== null) {
        ret["analogInputs"][rOne[1]] = {};
    }

    while ((rOne = regExpDigitalIn.exec(code)) !== null) {
        ret["digitalInputs"][rOne[1]] = {};
    }

    while ((rOne = regExpAnalogOut.exec(code)) !== null) {
        ret["analogOutputs"][rOne[1]] = {}
    }

    while ((rOne = regExpDigitalOut.exec(code)) !== null) {
        ret["digitalOutputs"][rOne[1]] = {}
    }

    while ((rOne = regExpMessageIn.exec(code)) !== null) {
        var types = [];
        for (var i = 2; i < rOne.length; i++) {
            if (isValidType(rOne[i])) {
                types.push(rOne[i].toLowerCase());
            }
        }
        ret["messageInputs"][rOne[1]] = {
            messageTypes: types
        };
    }

    while ((rOne = regExpMessageOut.exec(code)) !== null) {
        var types = [];
        for (var i = 2; i < rOne.length; i++) {
            if (isValidType(rOne[i])) {
                types.push(rOne[i].toLowerCase());
            }
        }
        ret["messageOutputs"][rOne[1]] = {
            messageTypes: types
        };
    }

    return ret;
};

const getAllInputOutputs = (mainCode:string, includes:any):{ [key:string]:any } => {

    var ret:{ [key:string]:any } = getInputsOutputs(mainCode);

    for (var k in includes) {
        if (!includes.hasOwnProperty(k)) continue;

        var retInclude = getInputsOutputs(includes[k]);

        for (var ik in retInclude["analogInputs"]) {
            if (!retInclude["analogInputs"].hasOwnProperty(ik)) continue;
            ret["analogInputs"][ik] = retInclude["analogInputs"][ik];
        }

        for (var ik in retInclude["digitalInputs"]) {
            if (!retInclude["digitalInputs"].hasOwnProperty(ik)) continue;
            ret["digitalInputs"][ik] = retInclude["digitalInputs"][ik];
        }

        for (var ik in retInclude["analogOutputs"]) {
            if (!retInclude["analogOutputs"].hasOwnProperty(ik)) continue;
            ret["analogOutputs"][ik] = retInclude["analogOutputs"][ik];
        }

        for (var ik in retInclude["digitalOutputs"]) {
            if (!retInclude["digitalOutputs"].hasOwnProperty(ik)) continue;
            ret["digitalOutputs"][ik] = retInclude["digitalOutputs"][ik];
        }

        for (var ik in retInclude["messageInputs"]) {
            if (!retInclude["messageInputs"].hasOwnProperty(ik)) continue;
            ret["messageInputs"][ik] = retInclude["messageInputs"][ik];
        }

        for (var ik in retInclude["messageOutputs"]) {
            if (!retInclude["messageOutputs"].hasOwnProperty(ik)) continue;
            ret["messageOutputs"][ik] = retInclude["messageOutputs"][ik];
        }
    }

    return ret;
};

/* tslint:enable */

export {isValidType, getInputsOutputs, getAllInputOutputs};
