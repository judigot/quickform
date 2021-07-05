<!--Item Body-->
<div class="element-source">
    <div class="item item-event context-menu" data-item-id="" data-item-type="event" data-item-name="" data-event-content="">
        <i class="fa fa-calendar item-icon" aria-hidden="true"></i><br>
        <span class="item-name"></span>
    </div>
    <div class="item item-form context-menu" data-item-id="" data-item-type="form" data-item-name="" data-form-content="">
        <i class="fa fa-file-text item-icon" aria-hidden="true"></i><br>
        <span class="item-name"></span>
    </div>
    <div class="item item-list context-list" data-item-id="" data-item-type="list" data-item-name="" data-list-content="">
        <i class="fa fa-list-ul item-icon" aria-hidden="true"></i><br>
        <span class="item-name"></span>
    </div>
    <div class="item item-report context-menu" data-item-id="" data-item-type="event" data-item-name="" data-report-content="">
        <i class="fa fa-file item-icon" aria-hidden="true"></i><br>
        <span class="item-name"></span>
    </div>
</div>

<!--Hidden Elements-->
<div id="fieldSource">
    <!--------------------Text Field-------------------->
    <div class="textField field-container" data-position="" data-title="Text Field" data-type="text" data-maxlength="">
        <?php require "field-buttons.php"; ?>
        <input type="" class="textInput">
    </div>
    <!--------------------Text Field-------------------->
    <!--------------------Boolean Field-------------------->
    <div class="booleanField field-container" data-position="" data-title="Boolean Field" data-type="boolean" data-default="false">
        <?php require "field-buttons.php"; ?>
        <label class="switch">
            <input type="checkbox" class="booleanInput">
            <span class="slider round"></span>
        </label>
    </div>
    <!--------------------Boolean Field-------------------->
    <!--------------------Dropdown Field-------------------->
    <div class="dropdownField field-container" data-position="" data-title="Dropdown Field" data-type="dropdown" data-options='{"options" : ["option 1", "option 2", "option 3", "option 4", "option 5"]}' data-default="option 1">
        <?php require "field-buttons.php"; ?>
        <select class="options">
        </select>
    </div>
    <!--------------------Dropdown Field-------------------->
    <!--------------------Time Field-------------------->
    <div class="timeField field-container" data-position="" data-title="Time Field" data-type="time">
        <?php require "field-buttons.php"; ?>
        <label class="switch">
            <input type="checkbox" class="time-input">
            <span class="slider round time-switch"></span>
        </label>
        <br>
    </div>
    <!--------------------Time Field-------------------->
    <!--------------------Radio Field-------------------->
    <div class="radioField field-container" data-position="" data-title="Radio Field" data-type="radio">
        <?php require "field-buttons.php"; ?>
        <input type="radio" id="">
    </div>
    <!--------------------Radio Field-------------------->
</div>

<!--Rename Item Modal-->
<div id="renameItem" class="modal" role="dialog">
    <div class="modal-dialog">
        <div class="title-bar">
            <div>
                <span class="window-title">Rename Item</span>
                <span class="title-bar-controls">
                    <span data-dismiss="modal"><i class="fa fa-window-close" aria-hidden="true"></i></span>
                </span>
            </div>
        </div>
        <div class="modal-content">
            <div class="modal-body">
                <input type="" class="textInput" id="newItemName">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn green" data-dismiss="modal" id="confirmRenameItem">Confirm</button>
                <button type="button" class="btn" data-dismiss="modal">Cancel</button>
            </div>
        </div>
    </div>
</div>

<!--Delete Item Modal-->
<div id="deleteItem" class="modal" role="dialog">
    <div class="modal-dialog">
        <div class="title-bar">
            <div>
                <span class="window-title">Delete Item</span>
                <span class="title-bar-controls">
                    <span data-dismiss="modal"><i class="fa fa-window-close" aria-hidden="true"></i></span>
                </span>
            </div>
        </div>
        <div class="modal-content">
            <div class="modal-body">
                Are you sure you want to delete this item?
            </div>
            <div class="modal-footer">
                <button type="button" class="btn green" data-dismiss="modal" id="confirmDeleteItem">Yes</button>
                <button type="button" class="btn" data-dismiss="modal">No</button>
            </div>
        </div>
    </div>
</div>

<!--Registration Form Modal-->
<div id="regEventForm" class="modal" role="dialog">
    <div class="modal-dialog">
        <div class="title-bar">
            <div>
                <span class="window-title">New Event</span>
                <span class="title-bar-controls">
                    <span data-dismiss="modal"><i class="fa fa-window-close" aria-hidden="true"></i></span>
                </span>
            </div>
        </div>
        <div class="modal-content">
            <div class="modal-body">
                <div id="regFormBody">
                    <div class="event-main-fields">
                        <input type="text" id="regEventTitle" placeholder="Event title">
                    </div>
                    <div id="regInfoContainer">
                        <div class="event-main-fields">
                            <input type="password" id="regEventPassword" placeholder="Password (optional)">
                            <i id="passVisibility" data-toggle="tooltip" title="Show password" data-placement="right" class="fa fa-eye field-option" aria-hidden="true"></i>
                            <br><br>
                            <div id="regDateAndTime">
                                <select id="regMonth">
                                    <option value="null" hidden>Month</option>
                                    <?php
                                    $month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                                    for ($i = 0; $i < sizeof($month); $i++) {
                                        ?>
                                        <option value="<?php echo $i < 9 ? "0" . ($i + 1) : $i + 1; ?>"<?php echo date("F") == $month[$i] ? " selected" : false; ?>><?php echo $month[$i]; ?></option>
                                        <?php
                                    }
                                    ?>
                                </select>
                                <select id="regDay">
                                    <option value="null" hidden>Day</option>
                                    <?php
                                    $counter = 0;
                                    for ($i = 0; $i < 4; $i++) {
                                        for ($j = 0; $j < 10; $j++) {
                                            if ($i == 0 && $j == 0) {
                                                true;
                                            } else if ($counter < 32) {
                                                $value = $i . $j;
                                                ?>
                                                <option value="<?php echo $value; ?>"<?php echo $value == date("d") ? " selected" : false; ?>><?php echo $i == 0 ? $j : $value; ?></option>
                                                <?php
                                            }
                                            $counter++;
                                        }
                                    }
                                    ?>
                                </select>
                                <select id="regYear">
                                    <option value="null" hidden>Year</option>
                                    <?php
                                    for ($i = date("Y"); $i < (date("Y") + 5); $i++) {
                                        echo date("Y") == $i ? "<option value='$i' selected>$i</option>" : "<option value='$i'>$i</option>";
                                    }
                                    ?>
                                </select>
                                <br>
                                <input type="text" placeholder="Start time" id="regStartTime" class="timepicker">
                                <span> to </span>
                                <input type="text" placeholder="End time" id="regEndTime" class="timepicker">
                            </div>
                        </div>
                        <hr>
                        <!--<span class="field-name">Event type:</span>-->
                        <span id="eventTypeLabel">Registration</span>
                        <br>
                        <label class="switch">
                            <input type="checkbox" id="listInput">
                            <span class="slider round event-type-switch"></span>
                        </label>
                        <br>
                        <div id="regFormOptionContainer">
                            <span>Form:</span>
                            <br>
                            <select class="form-dropdown reg-dropdown">
                            </select>
                            <i data-toggle="tooltip" title="View selected form" data-placement="right" class="fa fa-eye field-option item-preview form-preview reg-form-preview" aria-hidden="true"></i>
                        </div>
                        <div id="attEventOptionsContainer">
                            <span class="field-name">List:</span>
                            <select id="list-dropdown">
                            </select>
                            <i id="listPreview" data-toggle="tooltip" title="View selected list" data-placement="right" class="fa fa-eye field-option item-preview" aria-hidden="true"></i>
                            <br>
                            <span>Send email notification:</span><br>
                            <label class="switch">
                                <input type="checkbox" id="emailNotification" class="booleanInput">
                                <span class="slider round enable-switch"></span>
                            </label>
                            <span class="field-option" data-toggle="tooltip" title="Edit email content" data-placement="right"><i id="editEmailTrigger" class="fa fa-pencil" aria-hidden="true"></i></span>
                            <span class="field-name">Special form:</span>
                            <select class="form-dropdown special-form-dropdown">
                            </select>
                            <i data-toggle="tooltip" title="View selected form" data-placement="right" class="fa fa-eye field-option item-preview form-preview special-form-preview" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn green" id="confirmRegEvent" data-dismiss="modal">Confirm</button>
                <button type="button" class="btn emptyNewList" data-dismiss="modal">Cancel</button>
            </div>
        </div>
    </div>
</div>

<!--Delete Item Modal-->
<div id="emailContent" class="modal" role="dialog">
    <div class="modal-dialog">
        <div class="title-bar">
            <div>
                <span class="window-title">Edit Email Content</span>
                <span class="title-bar-controls">
                    <span data-dismiss="modal"><i class="fa fa-window-close" aria-hidden="true"></i></span>
                </span>
            </div>
        </div>
        <div class="modal-content">
            <div id="emailContainer">
                <input type="text" placeholder="Subject" id="emailSubject">
                <hr>
                <div id="emailBody" contenteditable="true"></div>
            </div>
            <div class="modal-body">

            </div>
            <div class="modal-footer">
                <button type="button" class="btn green" data-dismiss="modal" id="confirmEmailContent">Confirm</button>
                <button type="button" class="btn" data-dismiss="modal">Cancel</button>
            </div>
        </div>
    </div>
</div>

<!--New Form Modal-->
<div id="newEventForm" class="modal" role="dialog">
    <div class="modal-dialog">
        <div class="title-bar">
            <div>
                <span class="window-title">New Form</span>
                <span class="title-bar-controls">
                    <span class="emptyNewEventForm" data-dismiss="modal"><i class="fa fa-window-close" aria-hidden="true"></i></span>
                </span>
            </div>
        </div>
        <div class="modal-content">
            <div class="modal-header">
                <input type="text" id="form-name" placeholder="Form name"><br>
                <span>Fields:</span><br>
                <span class="btn addField formField" value="text"> Text <i class="fa fa-plus" aria-hidden="true"></i></span>
                <span class="btn addField formField" value="boolean"> Boolean <i class="fa fa-plus" aria-hidden="true"></i></span>
                <span class="btn addField formField" value="dropdown"> Dropdown <i class="fa fa-plus" aria-hidden="true"></i></span>
                <span class="btn addField formField" value="time"> Time <i class="fa fa-plus" aria-hidden="true"></i></span>
                <!--<span class="addField formField" value="radio"> Radio <i class="fa fa-plus" aria-hidden="true"></i></span>-->
            </div>
            <div class="modal-body">
                <span>Form preview:</span><br>
                <span class="removeAllFields removeAllFormFields"> Clear <i class="fa fa-refresh" aria-hidden="true"></i></span><br><br>
                <div id="formPreview"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn green" id="confirmNewEventForm">Confirm</button>
                <button type="button" class="btn emptyNewEventForm" data-dismiss="modal">Cancel</button>
            </div>
        </div>
    </div>
</div>

<div id="formViewerModal" class="modal" role="dialog">
    <div class="modal-dialog">
        <div class="title-bar">
            <div>
                <span class="window-title">New Form</span>
                <span class="title-bar-controls">
                    <span class="emptyNewEventForm" data-dismiss="modal"><i class="fa fa-window-close" aria-hidden="true"></i></span>
                </span>
            </div>
        </div>
        <div class="modal-content">
            <div class="modal-body">
                <div id="formViewer"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn emptyNewEventForm" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<!--New List Modal-->
<div id="newEventList" class="modal" role="dialog">
    <div class="modal-dialog">
        <div class="title-bar">
            <div>
                <span class="window-title">New List</span>
                <span class="title-bar-controls">
                    <span class="emptyNewEventList" data-dismiss="modal"><i class="fa fa-window-close" aria-hidden="true"></i></span>
                </span>
            </div>
        </div>
        <div class="modal-content">
            <div class="modal-body">
                <form id="uploadListForm" action="" method="">
                    <input type="file" name="listContent" accept=".csv" class="btn" id="listContent">
                    <input type="submit" name="submitListForm" id="submitListForm">
                </form>
                <div class="button-options-body">
                    <div class="button-options">
                        <button type="button" class="btn" id="uploadListTrigger">Upload</button>
                        <form target="_blank" method="POST" action="list">
                            <button type="submit" id="createListTrigger" name="createList" class="btn">Create</button>
                        </form>
                    </div>
                    <div id="newListContent"></div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn green" id="confirmNewEventList" data-dismiss="modal">Confirm</button>
                <button type="button" class="btn emptyNewEventList" data-dismiss="modal">Cancel</button>
            </div>
        </div>
    </div>
</div>

<!--Form Field Modal Editors-->

<!--Text Field Edit-->
<div id="editTextField" class="modal" role="dialog">
    <div class="modal-dialog">
        <div class="title-bar">
            <div>
                <span class="window-title">Edit Text Field</span>
                <span class="title-bar-controls">
                    <span data-dismiss="modal"><i class="fa fa-window-close" aria-hidden="true"></i></span>
                </span>
            </div>
        </div>
        <div class="modal-content">
            <div id="editTextFieldFields" class="modal-body">
                <input type="text" id="newTextFieldTitle" class="editTextFieldInput" placeholder="Title">
                <br>
                <span>Text Type:</span>
                <br>
                <select class="editTextType">
                    <option value="text">text</option>
                    <option value="number">number</option>
                </select>
                <hr>
                <div id="textTypeEdit">
                    <span>Maximum Length:</span>
                    <input type="number" id="newMaxLength" class="editTextFieldInput" min="0">
                </div>
                <div id="numberTypeEdit">
                    <span>Range:</span><br>
                    <input type="number" id="newMinRange" class="editRange" placeholder="Minimum">
                    <input type="number" id="newMaxRange" class="editRange" placeholder="Maximum">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn" id="confirmTextFieldEdits">Confirm</button>
                <!--<button type="button" class="btn" data-dismiss="modal">Close</button>-->
            </div>
        </div>
    </div>
</div>
<!--Boolean Field Edit-->
<div id="editBooleanField" class="modal" role="dialog">
    <div class="modal-dialog">
        <div class="title-bar">
            <div>
                <span class="window-title">Edit Boolean Field</span>
                <span class="title-bar-controls">
                    <span data-dismiss="modal"><i class="fa fa-window-close" aria-hidden="true"></i></span>
                </span>
            </div>
        </div>
        <div class="modal-content">
            <div id="editBooleanFieldFields" class="modal-body">
                <input type="text" id="newBooleanFieldTitle" class="editTextFieldInput" placeholder="Title">
                <hr>
                <span>Default:</span><br>
                <label class="switch">
                    <input type="checkbox" id="newBooleanFieldDefault">
                    <span class="slider round"></span>
                </label>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn" id="confirmBooleanFieldEdits">Confirm</button>
                <!--<button type="button" class="btn" data-dismiss="modal">Close</button>-->
            </div>
        </div>
    </div>
</div>
<!--Dropdown Field Edit-->
<div id="editDropdownField" class="modal" role="dialog">
    <div class="modal-dialog">
        <div class="title-bar">
            <div>
                <span class="window-title">Edit Dropdown Field</span>
                <span class="title-bar-controls">
                    <span data-dismiss="modal"><i class="fa fa-window-close" aria-hidden="true"></i></span>
                </span>
            </div>
        </div>
        <div class="modal-content">
            <div id="editDropdownFieldFields" class="modal-body">
                <input type="text" id="newDropdownFieldTitle" class="editTextFieldInput" placeholder="Title">
                <hr>
                <span>Default:</span>
                <select id="defaultOption">
                </select>
                <br><br>
                <input type="text" id="newDropdownOption" placeholder="Add new option"><span> <i class="fa fa-plus fa-1 addNewOption" aria-hidden="true"></i></span><br>
                <br>
                <div id="oldOptions">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn" id="confirmDropdownFieldEdits">Confirm</button>
                <!--<button type="button" class="btn" data-dismiss="modal">Close</button>-->
            </div>
        </div>
    </div>
</div>
<!--Time Field Edit-->
<div id="editTimeField" class="modal" role="dialog">
    <div class="modal-dialog">
        <div class="title-bar">
            <div>
                <span class="window-title">Edit Time Field</span>
                <span class="title-bar-controls">
                    <span data-dismiss="modal"><i class="fa fa-window-close" aria-hidden="true"></i></span>
                </span>
            </div>
        </div>
        <div class="modal-content">
            <div id="editTimeFieldFields" class="modal-body">
                <input type="text" id="newTimeFieldTitle" class="editTextFieldInput" placeholder="Title">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn" id="confirmTimeFieldEdits">Confirm</button>
                <!--<button type="button" class="btn" data-dismiss="modal">Close</button>-->
            </div>
        </div>
    </div>
</div>
<!--Radio Field Edit-->
<div id="editRadioField" class="modal" role="dialog">
    <div class="modal-dialog">
        <div class="title-bar">
            <div>
                <span class="window-title">Edit Radio Field</span>
                <span class="title-bar-controls">
                    <span data-dismiss="modal"><i class="fa fa-window-close" aria-hidden="true"></i></span>
                </span>
            </div>
        </div>
        <div class="modal-content">
            <div id="editRadioFieldFields" class="modal-body">
                <input type="text" id="newRadioFieldTitle" class="editTextFieldInput" placeholder="Title">
                <hr>
                <span>Default:</span><br>
                <input type="checkbox" id="newRadioFieldDefault">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn" id="confirmRadioFieldEdits">Confirm</button>
                <!--<button type="button" class="btn" data-dismiss="modal">Close</button>-->
            </div>
        </div>
    </div>
</div>
<!--Form Field Modal Editors-->