// *******************************************************
tags = new Array();
// *******************************************************
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
  if ((normalmode(theform)) || (vbcode=="IMG")) {
    inserttext = prompt(tag_prompt+"\n["+vbcode+"]xxx[/"+vbcode+"]",prompttext);
    if ((inserttext != null) && (inserttext != "")) {
      theform.message.value += "["+vbcode+"]"+inserttext+"[/"+vbcode+"] ";
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
      theform.message.value += "["+vbcode+"]";
      arraypush(tags,vbcode);
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
  var prompttext;
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
      theform.message.value += "["+thetype+"="+linkurl+"]"+linktext+"[/"+thetype+"] ";
    } else {
      theform.message.value += "["+thetype+"]"+linkurl+"[/"+thetype+"] ";
    }
  }
  theform.message.focus();
}
// *******************************************************
function dolist(theform) { // inserts list with option to have numbered or alphabetical type
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
  theform.message.value += thelist+listend;
  theform.message.focus();
}
// *******************************************************
function smilie(thesmilie) {
  document.vbform.message.value += thesmilie+" ";
  document.vbform.message.focus();
}
function opensmiliewindow(x,y,sessionhash) {
  window.open("misc.php?action=getsmilies&s="+sessionhash, "smilies", "toolbar=no,scrollbars=yes,resizable=yes,width="+x+",height="+y);
}
// *******************************************************