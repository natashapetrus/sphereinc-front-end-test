/* ShiftCheckbox jQuery plugin
 *
 * Copyright (C) 2011-2012 James Nylen
 *
 * Released under MIT license
 * For details see:
 * https://github.com/nylen/shiftcheckbox
 *
 * Requires jQuery v1.7 or higher.
 */

(function($) {
	var ns = '.shiftcheckbox';

	$.fn.shiftcheckbox = function(opts) {
		opts = $.extend({
			checkboxSelector : null,
			selectAll				: null,
			onChange				 : null,
			ignoreClick			: null
		}, opts);

		if (typeof opts.onChange != 'function') {
			opts.onChange = function(checked) { };
		}

		$.fn.scb_changeChecked = function(opts, checked) {
			this.prop('checked', checked);
			opts.onChange.call(this, checked);
			return this;
		}

		var $containers,
				$checkboxes,
				$containersSelectAll,
				$checkboxesSelectAll,
				$otherSelectAll,
				$containersAll,
				$checkboxesAll;

		if (opts.selectAll) {
			// We need to set up a "select all" control
			$containersSelectAll = $(opts.selectAll);
			if ($containersSelectAll && !$containersSelectAll.length) {
				$containersSelectAll = false;
			}
		}

		if ($containersSelectAll) {
			$checkboxesSelectAll = $containersSelectAll
				.filter(':checkbox')
				.add($containersSelectAll.find(':checkbox'));

			$containersSelectAll = $containersSelectAll.not(':checkbox');
			$otherSelectAll = $containersSelectAll.filter(function() {
				return !$(this).find($checkboxesSelectAll).length;
			});
			$containersSelectAll = $containersSelectAll.filter(function() {
				return !!$(this).find($checkboxesSelectAll).length;
			}).each(function() {
				$(this).data('childCheckbox', $(this).find($checkboxesSelectAll)[0]);
			});
		}

		if (opts.checkboxSelector) {

			// checkboxSelector means that the elements we need to attach handlers to
			// ($containers) are not actually checkboxes but contain them instead

			$containersAll = this.filter(function() {
				return !!$(this).find(opts.checkboxSelector).filter(':checkbox').length;
			}).each(function() {
				$(this).data('childCheckbox', $(this).find(opts.checkboxSelector).filter(':checkbox')[0]);
			}).add($containersSelectAll);

			$checkboxesAll = $containersAll.map(function() {
				return $(this).data('childCheckbox');
			});

		} else {

			$checkboxesAll = this.filter(':checkbox');

		}

		if ($checkboxesSelectAll && !$checkboxesSelectAll.length) {
			$checkboxesSelectAll = false;
		} else {
			$checkboxesAll = $checkboxesAll.add($checkboxesSelectAll);
		}

		if ($otherSelectAll && !$otherSelectAll.length) {
			$otherSelectAll = false;
		}

		if ($containersAll) {
			$containers = $containersAll.not($containersSelectAll);
		}
		$checkboxes = $checkboxesAll.not($checkboxesSelectAll);

		if (!$checkboxes.length) {
			return;
		}

		var lastIndex = -1;

		var checkboxClicked = function(e) {
			var checked = !!$(this).prop('checked');

			var curIndex = $checkboxes.index(this);
			if (curIndex < 0) {
				if ($checkboxesSelectAll.filter(this).length) {
					$checkboxesAll.scb_changeChecked(opts, checked);
				}
				return;
			}

			if (e.shiftKey && lastIndex != -1) {
				var di = (curIndex > lastIndex ? 1 : -1);
				for (var i = lastIndex; i != curIndex; i += di) {
					$checkboxes.eq(i).scb_changeChecked(opts, checked);
				}
			}

			if ($checkboxesSelectAll) {
				if (checked && !$checkboxes.not(':checked').length) {
					$checkboxesSelectAll.scb_changeChecked(opts, true);
				} else if (!checked) {
					$checkboxesSelectAll.scb_changeChecked(opts, false);
				}
			}

			lastIndex = curIndex;
		};

		if ($checkboxesSelectAll) {
			$checkboxesSelectAll
				.prop('checked', !$checkboxes.not(':checked').length)
				.filter(function() {
					return !$containersAll.find(this).length;
				}).on('click' + ns, checkboxClicked);
		}

		if ($otherSelectAll) {
			$otherSelectAll.on('click' + ns, function() {
				var checked;
				if ($checkboxesSelectAll) {
					checked = !!$checkboxesSelectAll.eq(0).prop('checked');
				} else {
					checked = !!$checkboxes.eq(0).prop('checked');
				}
				$checkboxesAll.scb_changeChecked(opts, !checked);
			});
		}

		if (opts.checkboxSelector) {
			$containersAll.on('click' + ns, function(e) {
				if ($(e.target).closest(opts.ignoreClick).length) {
					return;
				}
				var $checkbox = $($(this).data('childCheckbox'));
				$checkbox.not(e.target).each(function() {
					var checked = !$checkbox.prop('checked');
					$(this).scb_changeChecked(opts, checked);
				});

				$checkbox[0].focus();
				checkboxClicked.call($checkbox, e);

				// If the user clicked on a label inside the row that points to the
				// current row's checkbox, cancel the event.
				var $label = $(e.target).closest('label');
				var labelFor = $label.attr('for');
				if (labelFor && labelFor == $checkbox.attr('id')) {
					if ($label.find($checkbox).length) {
						// Special case:	The label contains the checkbox.
						if ($checkbox[0] != e.target) {
							return false;
						}
					} else {
						return false;
					}
				}
			}).on('mousedown' + ns, function(e) {
				if (e.shiftKey) {
					// Prevent selecting text by Shift+click
					return false;
				}
			});
		} else {
			$checkboxes.on('click' + ns, checkboxClicked);
		}

		return this;
	};
})(jQuery);

function setInfoText(text) {
	$('.day-link').text(text);
	if (console && console.log) console.log(text);
}

$(function () {
    if (false) { // function not executed
        $('.day div.checkbox').shiftcheckbox({

            // Options accept selectors, jQuery objects, or DOM
            // elements.

            checkboxSelector: ':checkbox',
            selectAll: $('.day .all'),
            ignoreClick: 'a',

            // The onChange function will be called whenever the
            // plugin changes the state of a checkbox.

            onChange: function (checked) {
                setInfoText(
                    'Changed checkbox ' + $(this).attr('id') + ' to ' + checked + ' programmatically');
            }

        });
    }

// If you also want to handle the user clicking on a
// checkbox, use the jQuery .change() event.

$('.day :checkbox').change(function() {
    setInfoText(
        'Clicked checkbox ' + $(this).attr('id') + ', checked=' + this.checked);
    var mobile = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));  
    if (mobile) { 
        // if mobile (touch) device
        // prevent mouse events when pop-up menu appears
        $('#whole-screen').css('display', 'inline'); // OR you can use $('.navWrap').hide();

        // get id of the clicked time
        selectedId = $(this).attr('id');
        let selectedDayId = selectedId.substring(0, 3);
        let selectedHourId = "";
        (selectedId.length == 8 || selectedId.length == 6) ? selectedHourId = selectedId.substring(3, 4) : selectedHourId = selectedId.substring(3, 5);
        let selectedMinuteId = "";
        selectedId.length >= 8 ? selectedMinuteId = ":" + selectedId.substring(selectedId.length - 4, selectedId.length - 2) : selectedMinuteId = ":00";
        let selectedAMPMId = selectedId.substring(selectedId.length - 2, selectedId.length).toUpperCase();

        // change pre-selected start time to clicked time
        document.getElementById('select-day-start').value = $("#select-day-start").find("option[data-label='" + selectedDayId + "']").val();
        document.getElementById('select-hour-start').value = $("#select-hour-start").find("option[label='" + selectedHourId + "']").val();
        document.getElementById('select-minute-start').value = $("#select-minute-start").find("option[label='" + selectedMinuteId + "']").val();
        document.getElementById('select-ampm-start').value = $("#select-ampm-start").find("option[label='" + selectedAMPMId + "']").val();

        // change pre-selected end time to clicked time
        document.getElementById('select-day-end').value = $("#select-day-end").find("option[data-label='" + selectedDayId + "']").val();
        document.getElementById('select-hour-end').value = $("#select-hour-end").find("option[label='" + selectedHourId + "']").val();
        document.getElementById('select-minute-end').value = $("#select-minute-end").find("option[label='" + selectedMinuteId + "']").val();
        document.getElementById('select-ampm-end').value = $("#select-ampm-end").find("option[label='" + selectedAMPMId + "']").val();
    } 
    else 
    { 
       // if not mobile (touch) device, do nothing
    }

    /**
        // prevent mouse events when pop-up menu appears
        let e = document.getElementById('whole-screen');
        e.style.display = "inline";

        // get id of the clicked time
        selectedId = $(this).attr('id');
        let selectedDayId = selectedId.substring(0, 3);
        let selectedHourId = "";
        (selectedId.length == 8 || selectedId.length == 6) ? selectedHourId = selectedId.substring(3, 4) : selectedHourId = selectedId.substring(3, 5);
        let selectedMinuteId = "";
        selectedId.length >= 8 ? selectedMinuteId = ":" + selectedId.substring(selectedId.length - 4, selectedId.length - 2) : selectedMinuteId = ":00";
        let selectedAMPMId = selectedId.substring(selectedId.length - 2, selectedId.length).toUpperCase();

        // update attribute of clicked time
        // to prevent pop up menu from appearing if previously selected time is selected again
        let updatedCheckbox = document.getElementById(selectedId);
        let newAttribute = document.createAttribute('isChecked');
        newAttribute.value = true;
        updatedCheckbox.setAttributeNode(newAttribute);

        // change pre-selected start time to clicked time
        document.getElementById('select-day-start').value = $("#select-day-start").find("option[data-label='" + selectedDayId + "']").val();
        document.getElementById('select-hour-start').value = $("#select-hour-start").find("option[label='" + selectedHourId + "']").val();
        document.getElementById('select-minute-start').value = $("#select-minute-start").find("option[label='" + selectedMinuteId + "']").val();
        document.getElementById('select-ampm-start').value = $("#select-ampm-start").find("option[label='" + selectedAMPMId + "']").val();

        // change pre-selected end time to clicked time
        document.getElementById('select-day-end').value = $("#select-day-end").find("option[data-label='" + selectedDayId + "']").val();
        document.getElementById('select-hour-end').value = $("#select-hour-end").find("option[label='" + selectedHourId + "']").val();
        document.getElementById('select-minute-end').value = $("#select-minute-end").find("option[label='" + selectedMinuteId + "']").val();
        document.getElementById('select-ampm-end').value = $("#select-ampm-end").find("option[label='" + selectedAMPMId + "']").val();
    **/
});


$('.demo a:not(.toggle-code)').click(function() {

		setInfoText('Clicked link: ' + $(this).attr('href')+ ' at ' + new Date());

		if ($(this).hasClass('block-click')) {
				return false;
		}
});
	
	$('.toggle-code').click(function() {
		var $pre = $(this).parent().next('pre');
		if ($pre.is(':visible')) {
			$pre.hide();
			$(this).text('show');
		} else {
			$pre.show();
			$(this).text('hide');
		}
		return false;
	});
});