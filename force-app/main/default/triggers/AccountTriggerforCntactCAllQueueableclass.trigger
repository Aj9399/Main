trigger AccountTriggerforCntactCAllQueueableclass on Account (after insert)
{      if(trigger.isafter && trigger.isinsert)
      {
          system.enqueuejob(new ContactCreationQueueable(trigger.new));
    
      }

}