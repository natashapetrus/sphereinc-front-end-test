function closePopUpMenu() { // executed when "cancel" button is pressed
    var e = document.getElementById('whole-screen');
    e.style.display = "none";
    console.log("Only 1 selection is made")
    // to toggle pop up menu:
    // e.style.display == "none" ? e.style.display = "inline" : e.style.display = "none";
    // ensure error message is hidden
    var e = document.getElementById('error-message');
    e.style.display = "none";
}
function numberMagnitude(number, magnitude) { // only used for function confirmed()
    return Math.floor(number / magnitude);
}
function confirmed() { // executed when "confirm" button is pressed
    let hourAdjustment = 0; // hour adjustment for 24-hour format

    // get selected start values
    var selectedDayStart = document.getElementById("select-day-start");
    var selectedDayStartValue = parseInt(selectedDayStart.options[selectedDayStart.selectedIndex].value);
    var selectedAMPMStart = document.getElementById("select-ampm-start");
    var selectedAMPMStartValue = parseInt(selectedAMPMStart.options[selectedAMPMStart.selectedIndex].value);
    switch (selectedAMPMStartValue) {
        case 1: // AM
            hourAdjustment = 0;
            break;
        case 2: // PM
            hourAdjustment = 1200;
            break;
        default:
            break;
    }
    var selectedHourStart = document.getElementById("select-hour-start");
    var selectedHourStartValue = parseInt(selectedHourStart.options[selectedHourStart.selectedIndex].value) + hourAdjustment;
    var selectedMinuteStart = document.getElementById("select-minute-start");
    var selectedMinuteStartValue = parseInt(selectedMinuteStart.options[selectedMinuteStart.selectedIndex].value);
    var selectedStartValue = selectedDayStartValue + selectedHourStartValue + selectedMinuteStartValue;
    console.log("Selected start value: " + selectedStartValue);

    // get selected end values
    var selectedDayEnd = document.getElementById("select-day-end");
    var selectedDayEndValue = parseInt(selectedDayEnd.options[selectedDayEnd.selectedIndex].value);
    var selectedAMPMEnd = document.getElementById("select-ampm-end");
    var selectedAMPMEndValue = parseInt(selectedAMPMEnd.options[selectedAMPMEnd.selectedIndex].value);
    switch (selectedAMPMEndValue) {
        case 1: // AM
            hourAdjustment = 0;
            break;
        case 2: // PM
            hourAdjustment = 1200;
            break;
        default:
            break;
    }
    var selectedHourEnd = document.getElementById("select-hour-end");
    var selectedHourEndValue = parseInt(selectedHourEnd.options[selectedHourEnd.selectedIndex].value) + hourAdjustment;
    var selectedMinuteEnd = document.getElementById("select-minute-end");
    var selectedMinuteEndValue = parseInt(selectedMinuteEnd.options[selectedMinuteEnd.selectedIndex].value);
    var selectedEndValue = selectedDayEndValue + selectedHourEndValue + selectedMinuteEndValue;
    console.log("Selected end value: " + selectedEndValue)

    // process the values
    for (let i = selectedStartValue; i <= selectedEndValue; i += 10) {
        let currentNumber = i;
        let strday = "";
        let strhour = "";
        let strminute = "";
        let strampm = "";
        switch (numberMagnitude(i, 10000)) { // get day in string
            case 1:
                strday = "sun"; currentNumber -= 1 * 10000;
                break;
            case 2:
                strday = "mon"; currentNumber -= 2 * 10000;
                break;
            case 3:
                strday = "tue"; currentNumber -= 3 * 10000;
                break;
            case 4:
                strday = "wed"; currentNumber -= 4 * 10000;
                break;
            case 5:
                strday = "thu"; currentNumber -= 5 * 10000;
                break;
            case 6:
                strday = "fri"; currentNumber -= 6 * 10000;
                break;
            case 7:
                strday = "sat"; currentNumber -= 7 * 10000;
                break;
            default:
                continue;
        }
        switch (numberMagnitude(currentNumber, 100) < 12) { // AM or PM
            case true: // AM
                strampm = "am";
                break;
            case false: // PM
                strampm = "pm";
                currentNumber -= 1200;
                break;
            default:
                continue;
        }
        switch (numberMagnitude(currentNumber, 100)) { // get hour (between 1-12)
            case 1:
                strhour = "1"; currentNumber -= 100;
                break;
            case 2:
                strhour = "2"; currentNumber -= 200;
                break;
            case 3:
                strhour = "3"; currentNumber -= 300;
                break;
            case 4:
                strhour = "4"; currentNumber -= 400;
                break;
            case 5:
                strhour = "5"; currentNumber -= 500;
                break;
            case 6:
                strhour = "6"; currentNumber -= 600;
                break;
            case 7:
                strhour = "7"; currentNumber -= 700;
                break;
            case 8:
                strhour = "8"; currentNumber -= 800;
                break;
            case 9:
                strhour = "9"; currentNumber -= 900;
                break;
            case 10:
                strhour = "10"; currentNumber -= 1000;
                break;
            case 11:
                strhour = "11"; currentNumber -= 1100;
                break;
            case 0: // 12 AM or PM
                strhour = "12"; currentNumber -= 0;
                break;
            default:
                continue;
        }
        switch (numberMagnitude(currentNumber, 10)) { // :00 or :30 ?
            case 0:
                strminute = "";
                break;
            case 3:
                strminute = "30";
                break;
            default:
                continue;
        }
        let strid = "" + strday + strhour + strminute + strampm; // get string id, e.g. = "sun1230pm"
        // select the checkbox based on the string id
        // document.getElementById(strid).checked = true;
        $("#" + strid).prop("checked", true);
        console.log("ID: " + strid + " selected");

        /**
        // update attribute of selected times
        // to prevent pop up menu from appearing if previously selected time is selected again --> not functional
        let updatedCheckbox = document.getElementById(strid);
        let newAttribute = document.createAttribute('isChecked');
        newAttribute.value = true;
        updatedCheckbox.setAttributeNode(newAttribute);
        **/
    }

    if (selectedStartValue > selectedEndValue) {
        // give error message
        var e = document.getElementById('error-message');
        e.style.display = "inline";
        console.log("Hidden error message appeared")
    }
    else { // if start time is earlier
        // hide the pop-up menu
        var e = document.getElementById('whole-screen');
        e.style.display = "none";
        // ensure error message is hidden
        var e = document.getElementById('error-message');
        e.style.display = "none";
        // log successful action
        console.log("Selection(s) successfully applied")
        // log attribute update 
        // console.log("Attributes updated to prevent selection of selected times")
    }
}