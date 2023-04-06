trigger accRECORD on Account (before insert , before update ) 
{ 
    if(trigger.isbefore)
    {
        if(trigger.isInsert)
        {
        AccountTriggerHandler.restrictDuplicacyOnAcc(trigger.new);
        AccountTriggerHandler.restrictDuplicacyonAccphone(trigger.new);
        }
        else if(trigger.isUpdate)
        {
        AccountTriggerHandler.restrictDuplicacyonAccphone(trigger.new);
        }
        else if (trigger.isdelete)
        {
            
        }
        else if(trigger.isafter)
        {
            
        }    
 }
}