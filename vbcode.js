// *******************************************************
tags = new Array();
// *******************************************************
// NEW STUFF
function getSelectionInfo (el) {
  var start = 0, end = 0, normalizedValue, range,
    textInputRange, len, endRange;

  if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
    start = el.selectionStart;
    end = el.selectionEnd;
  } else {
    range = document.selection.createRange();

    if (range && range.parentElement() == el) {
      len = el.value.length;
      normalizedValue = el.value.replace(/\r\n/g, "\n");

      // Create a working TextRange that lives only in the input
      textInputRange = el.createTextRange();
      textInputRange.moveToBookmark(range.getBookmark());

      // Check if the start and end of the selection are at the very end
      // of the input, since moveStart/moveEnd doesn't return what we want
      // in those cases
      endRange = el.createTextRange();
      endRange.collapse(false);

      if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
        start = end = len;
      } else {
        start = -textInputRange.moveStart("character", -len);
        start += normalizedValue.slice(0, start).split("\n").length - 1;

        if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
          end = len;
        } else {
          end = -textInputRange.moveEnd("character", -len);
          end += normalizedValue.slice(0, end).split("\n").length - 1;
        }
      }
    }
  }

  return [ start, end ];
};

function insertAt(position, str) {
  var isArray = typeof position.length !== "undefined",
    start = isArray ? position[0] : position,
    end = isArray? position[1] ? position[1] : position[0] : position,
    input = document.vbform.message,
    val = input.value,
    parts = [ val.substr(0, start), str, val.substr(end) ];
  
  input.value = parts.join('');
  input.focus();
};

function surroundSelection(selectionInfo, before, after) {
  var input = document.vbform.message,
    val = input.value,
    parts = [
      val.substr(0, selectionInfo[0]),
      before + val.substr(selectionInfo[0], selectionInfo[1] - selectionInfo[0]) + after,
      val.substr(selectionInfo[1])
    ];
  
  input.value = parts.join('');
  input.focus();
};
// END NEW STUFF

function getarraysize(thearray) {
  for (i = 0; i < thearray.length; i++) {
    if ((thearray[i] == "undefined") || (thearray[i] == "") || (thearray[i] == null)) {
      return i;
    }
  }
  return thearray.length;
}
function arraypush(thearray,value) {
  thearraysize = getarraysize(thearray);
  thearray[thearraysize] = value;
}
function arraypop(thearray) {
  thearraysize = getarraysize(thearray);
  retval = thearray[thearraysize - 1];
  delete thearray[thearraysize - 1];
  return retval;
}
// *******************************************************
function setmode(modevalue) {
  document.cookie = "vbcodemode="+modevalue+"; path=/; expires=Wed, 1 Jan 2040 00:00:00 GMT;";
}
function normalmode(theform) {
  if (theform.mode[0].checked) {
    return true;
  } else {
    return false;
  }
}
function stat(thevalue) {
  document.vbform.status.value = eval(thevalue+"_text");
}
// *******************************************************
function closetag(theform) {
  if (normalmode(theform)) {
    stat('enhanced_only');
  } else {
    if (tags[0]) {
      theform.message.value += "[/"+ arraypop(tags) +"]";
    } else {
      stat('no_tags');
    }
  }
  theform.message.focus();
}
function closeall(theform) {
  if (normalmode(theform)) {
    stat('enhanced_only');
  } else {
    if (tags[0]) {
      while (tags[0]) {
        theform.message.value += "[/"+ arraypop(tags) +"]";
      }
      theform.message.value += " ";
    } else {
      stat('no_tags');
    }
  }
  theform.message.focus();
}
// *******************************************************
function vbcode(theform,vbcode,prompttext) { // insert [x]yyy[/x] style markup
  var positionInfo = getSelectionInfo(theform.message);
  
  // We have a selection, do selection-y stuff
  if (positionInfo[1]) {
    if (positionInfo[1] !== positionInfo[0])
      return surroundSelection(positionInfo, '[' + vbcode + ']', "[/" + vbcode + ']');
  }
  
  if ((normalmode(theform)) || (vbcode=="IMG")) {
    inserttext = prompt(tag_prompt+"\n["+vbcode+"]xxx[/"+vbcode+"]",prompttext);
    if ((inserttext != null) && (inserttext != "")) {
      insertAt(positionInfo, "["+vbcode+"]"+inserttext+"[/"+vbcode+"]");
    }
  } else {
    donotinsert = false;
    for (i = 0; i < tags.length; i++) {
      if (tags[i] == vbcode) {
        donotinsert = true;
      }
    }
    if (donotinsert) {
      stat("already_open");
    } else {
      arraypush(tags,vbcode);
      return insertAt(positionInfo, '[' + vbcode + ']');
    }
  }
  theform.message.focus();
}
// *******************************************************
function fontformat(theform,thevalue,thetype) { // insert two-parameter markup - [x=y]zzz[/x]
  if (normalmode(theform)) {
    if (thevalue != 0) {
      inserttext = prompt(font_formatter_prompt+" "+thetype,"");
      if ((inserttext != null) && (inserttext != "")) {
        theform.message.value += "["+thetype+"="+thevalue+"]"+inserttext+"[/"+thetype+"] ";
      }
    }
  } else {
    theform.message.value += "["+thetype+"="+thevalue+"]";
    arraypush(tags,thetype);
  }
  theform.sizeselect.selectedIndex = 0;
  theform.fontselect.selectedIndex = 0;
  theform.colorselect.selectedIndex = 0;
  theform.message.focus();
}
// *******************************************************
function namedlink(theform,thetype) { // inserts named url or email link - [url=mylink]text[/url]
  var positionInfo = getSelectionInfo(theform.message),
    prompttext;
  if (thetype == "url") {
    linktext = prompt(link_text_prompt,"");
    prompt_text = link_url_prompt;
    prompt_contents = "http://";
  } else if (thetype == "youtube") {
    linktext = prompt(youtube_text_prompt,"");
    prompt_text = youtube_id_prompt;
    prompt_contents = "";
  } else {
    linktext = prompt(link_text_prompt,"");
    prompt_text = link_email_prompt;
    prompt_contents = "";
  }
  linkurl = prompt(prompt_text,prompt_contents);
  if ((linkurl != null) && (linkurl != "")) {
    if ((linktext != null) && (linktext != "")) {
      insertAt(positionInfo, "["+thetype+"="+linkurl+"]"+linktext+"[/"+thetype+"]");
    } else {
      insertAt(positionInfo, "["+thetype+"]"+linkurl+"[/"+thetype+"]");
    }
  }
  theform.message.focus();
}
// *******************************************************
function dolist(theform) { // inserts list with option to have numbered or alphabetical type
  var positionInfo = getSelectionInfo(theform.message);
  listtype = prompt(list_type_prompt, "");
  if ((listtype == "a") || (listtype == "1")) {
    thelist = "[list="+listtype+"]\n";
    listend = "[/list="+listtype+"] ";
  } else {
    thelist = "[list]\n";
    listend = "[/list] ";
  }
  listentry = "initial";
  while ((listentry != "") && (listentry != null)) {
    listentry = prompt(list_item_prompt, "");
    if ((listentry != "") && (listentry != null)) {
      thelist = thelist+"[*]"+listentry+"\n";
    }
  }
  insertAt(positionInfo, thelist+listend);
}
// *******************************************************
function smilie(thesmilie) {
  var input = document.vbform.message,
    position = getSelectionInfo(input);

  insertAt(position, thesmilie);
}
function opensmiliewindow(x,y,sessionhash) {
  window.open("misc.php?action=getsmilies&s="+sessionhash, "smilies", "toolbar=no,scrollbars=yes,resizable=yes,width="+x+",height="+y);
}
// *******************************************************