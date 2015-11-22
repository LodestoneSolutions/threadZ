# threadZ
threadZ is a lightweight library used to create javascript threads Written by Nadav AncientZed Yogev and Or som0 Straze for Lodestone Solutions pty ltd http://www.lodestonesolutions.com.au

#use case sample: 
var funcToRun = function(){....};//can have up to 4 vars -> funcToRun = function(a,b,c,d){....}; 
var funcToRunOnComplete = function(res){....};//res is the return value of funcToRun 
threadZ.addTask(funcToRun,funcToRunOnComplete,var1,...,var4); 
//vars are optional can just as well call 
threadZ.addTask(funcToRun,funcToRunOnComplete); 
threadZ.run();//will execute all the pending functions on different threads, max 3 at the time can be configured otherwise as well
