import Header from './Header';
import Body from './Body';
import uuid from "react-uuid";
import {useState, useEffect} from "react";

function App() {

  const [click, setClick] = useState(false)
  const [addingObituary,  setAddingObituary] =  useState(false);
  const [isInputEdited, setIsInputEdited] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [imgAdded, setImgAdded] = useState(false);
  const [changeBorn, setChangeBorn] = useState(false);


  function newObituary(){
    setAddingObituary(true)
    setClick(false)
    setIsInputEdited(false)
    setIsClicked(false)
    setImgAdded(false)
    setChangeBorn(false)
  };
  
  function exit(){
    setClick(false)
    setIsInputEdited(false)
    setIsClicked(false)
    setAddingObituary(false)
    setImgAdded(false)
    setChangeBorn(false)
  }

  

 


  return (
  <div style={{height: "100%"}} >
    <Header addingObituary={addingObituary} newObituary={newObituary}/>
    <Body addingObituary={addingObituary} setAddingObituary={setAddingObituary} exit={exit} click={click} setClick={setClick} isInputEdited={isInputEdited} setIsInputEdited={setIsInputEdited} isClicked={isClicked} setIsClicked={setIsClicked} imgAdded={imgAdded} setImgAdded={setImgAdded} changeBorn={changeBorn} setChangeBorn={setChangeBorn}/>
  </div>
)}

export default App;
