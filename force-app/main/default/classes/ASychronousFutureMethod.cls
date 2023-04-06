// Asychronous : it is something which  runs in background,          (basically things that does not need user interaction 
//               without having you wait for that task to finish.      like button click , giving input),move it to asychronous.
//          
//             DisAdvantage : you can not call one future method from another future method,
//                                can have only primitive as a parameter.
//                                                                     
//  1)FUTURE METHOD : IT is a set of code which we runs in Background.(@Future - annotation )                 
//                  : in all the future method , return type is STATIC VOID .
//                  : it takes only primitive type(boolean , integer, list of iD and all,sObjects are not allowed) as parameters 
//                  : we can insert user and profile in a object  with the help of future method.
//                  
//         By writing @future annotation the method will run in a seperate transction.
//                  
//   Note : mixed Dml exception = when we want to insert setup(user,profile ,group, emailtemplates etc) 
//           and non setup object(all other standard and custom objct) in one transaction , thn we will occur that exception.
//                      
//                  
  




public class ASychronousFutureMethod 
{
      public ASychronousFutureMethod()       //it is a constructor which is called first, here we have to write methodsName(); 
    {                                        //how we can call it from execute window , just 
                                             //ASychronousFutureMethod a = new ASychronousFutureMethod();

        takeShower();
        havebreakfast();
        carServicing();
    }
    
    Public static void takeShower()
    {
        system.debug('i take my bath ');
    }
    
    Public static void havebreakfast()
    {
        system.debug('i take my breakfast');
    }
    
    @Future                                   //this will run as Asychronous and all 2 will run as sychronous.
    Public static void carServicing()
    {                                         
        system.debug('car is being repaired');  //it will run in a different log
    }
}