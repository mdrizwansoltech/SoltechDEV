global class HOG_CombinationCreationSchedularClass implements Schedulable {
   global void execute(SchedulableContext sc) {
     HOG_CombinationEntryBatch b = new HOG_CombinationEntryBatch(); 
      database.executebatch(b);
   }
}