public class Sales {
    public static void my(){
       /*Integer A = 123;
        String S  = 'Salesforce';
      
        system.debug('Value is =' +A);
        system.debug('String is =' +S);

           Check whether the number is even or odd  

        Integer n = 9;             
        Integer r ;
        r = System.Math.mod(n, 3);   in N the number of value get inserted and will divided by 2
        if(r == 0)
        {
            system.debug('The no is divisible ');
        }Else
        {
            system.debug('The no is not divisible');
        }
        
            Integer dep = 1;
                while(dep < = 10)           result will be  salesforce 10 times;
            {
                system.debug('Salesforce');
                dep = dep+1;
            }
                           Example of for loop

        for(Integer J = 0 ; J<=5 ; J++)
        {
          system.debug('RAM')  ;
        }
                          Example of array           

        integer [] a = new integer[4];
        a[0] = 10;
        a[1] = 20;
          system.debug(a[2]);  
          
        Account acc = new Account (Name = 'AJay' , Phone = '6666');// initialisation of s object 

        system.debug('yoBrother= '+acc);
        
             //Initialisation of list of String datatype
       list<string> strlst = new list<string>();// we can add values from [Variable.add('value')];
       strlst.add('A');
        strlst.add('B');
        system.debug('result is= '+strlst);*/   // we can get values from index [Integer i = variable.get[indexvalue]]
        List<Account> acclst = [SELECT id, Name from Account Limit 2 ];
        system.debug('Result= '+acclst);
              
        
    }
}