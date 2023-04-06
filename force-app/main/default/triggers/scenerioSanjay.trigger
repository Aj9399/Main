trigger scenerioSanjay on Account (before insert) 
{
   scenerio01.accHandler(trigger.new);
}