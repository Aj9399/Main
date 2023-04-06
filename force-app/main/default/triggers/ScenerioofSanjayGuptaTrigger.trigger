trigger ScenerioofSanjayGuptaTrigger on Account (after insert , after update , before insert , before update)
{ 
    if(Trigger.isBefore)
    {
        if(trigger.isInsert)
        {
            
        }
   
    else if (trigger.isUpdate)
        {
            ScenerioofSanjayGupta.updateAccDescOnPhoneUpdate(trigger.new ,trigger.oldmap);
        }
    }
    
    else if(trigger.isAfter)
    { 
        if(trigger.isInsert)
        {
            ScenerioofSanjayGupta.AccCheckboxHAndler(trigger.new);
        }
         
        else if(trigger.isupdate)
        {
            
        }
    }
}