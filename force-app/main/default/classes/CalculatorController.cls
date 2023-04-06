public class CalculatorController
{
    public Decimal firstNumber{get;set;}  //--> declaring a variable with get,set , it will work like property

    public Decimal secondNumber{get;set;} 
    
    public Decimal result{get;set;} 
    
    
    public void sum(){
        
        result = firstNumber + secondNumber;
    }
    
    public void subs(){
        
        result = firstNumber - secondNumber;
    }
    
    public void multi(){
        
        result = firstNumber * secondNumber;
    } 
    
    
}