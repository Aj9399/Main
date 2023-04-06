public class scenerio01
{
    public static void accHandler(list<account> acclst)
    {
        for(account acc : acclst)
        {
            if(acc.industry == 'Media' || acc.industry == 'energy') 
            {
                acc.rating = 'Hot';
            }
             else(acc.rating = 'cold');
        }

    }
}