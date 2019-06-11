trigger OrderItemTrigger on OrderItem (after insert,after update) {

    if((trigger.isAfter && trigger.isInsert )|| (trigger.isAfter && trigger.Isupdate))
    {
        HOG_OrderItemTriggerHelper helper=new HOG_OrderItemTriggerHelper();
        helper.CreateCombinationEntryRecords(trigger.new);
    }

}