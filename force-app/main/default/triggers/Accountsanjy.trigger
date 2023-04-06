trigger Accountsanjy on Account (before insert , after insert , before update , after update) {
    if(trigger.isInsert){
        if(trigger.isbefore){
            accountsanjayguptatriggerhandler.updateRating(trigger.new); 
      }  
        Else if (trigger.isAfter){
            accountsanjayguptatriggerhandler.createRelatedrec(trigger.new);
        }
    }
    if(trigger.isupdate){
        if(trigger.isbefore){
            accountsanjayguptatriggerhandler.updatePhoneDescription(trigger.new , trigger.OldMap);
        }
    }
}