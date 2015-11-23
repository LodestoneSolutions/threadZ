#threadZ
threadZ is a lightweight javascript threads library used to mimick the functionality provided by webworkers (allowing support for threading in IE6) by running code outside of a given scope. 

Written by *Nadav "AncientZed" Yogev* and *Or "Som0" Straze* for Lodestone Solutions Pty Ltd http://www.lodestonesolutions.com.au

#Use case sample:
```Javascript
var funcToRun = function()
{ 
  ////Can have up to 4 vars -> funcToRun = function(a,b,c,d){....};  
}; 
var funcToRunOnComplete = function(res)
{
  //res is the return value of funcToRun 
}; 

threadZ.addTask(funcToRun,funcToRunOnComplete,var1,...,var4); 
threadZ.run(); //Will execute all the pending functions on different threads (default are 3 threads, can be configured)
```

##### Vars are optional, can just as well call 
```
threadZ.addTask(funcToRun,funcToRunOnComplete); 
```
