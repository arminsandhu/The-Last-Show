import {useState, useEffect} from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import uuid from "react-uuid";
import { stringify } from "uuid";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';


const bodyWrapper = {
    flex: "70%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const dates = {
    display: "flex",
    marginTop: "12px",
    marginBottom: "12px",
    border: "none",
    justifyContent: "spaceBetween"
}


const dates1 = {
    display: "flex",
    justifyContent: "flex-end"
}


const dates2 = {
    display: "flex",
    justifyContent: "flex-start"

}

const newObit = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
}




const Body = ({addingObituary, setAddingObituary, exit, click, setClick, isInputEdited, setIsInputEdited, isClicked, setIsClicked, imgAdded, setImgAdded, changeBorn, setChangeBorn}) => {
    
    const now = new Date();
    const isoString = now.toISOString().slice(0, 16);
    const [obituaries, setObituaries] = useState([]);
    const [name, setName] = useState("");
    const [bornDate, setBornDate] = useState("");
    const [diedDate, setDiedDate] = useState("");
    const [image, setImage] = useState(null);
    const [cards, setCards] = useState([]);
    const [deathString, setDeathString] = useState("");
    const [birthdayString, setBirthdayString] = useState("");
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const [file, setFile] = useState(null)
    const [id, setId] = useState("")
    const [count, setCount] = useState(0); 


    useEffect(() => {
        if (!addingObituary) {
            setDeathString("");
            setBirthdayString("");
            setImage(null);
        }
        if (addingObituary){
            const today = new Date();
            const month = today.getMonth();
            const year = today.getFullYear();
            const day = today.getDate();
            const monthName = monthNames[month]; 
            setDeathString(`${monthName} ${day}, ${year}`);
        }
    }, [addingObituary]);


    // this dont work yet
    useEffect(() => {
        const preObits = JSON.parse(localStorage.getItem("obituaries"));
        if (preObits) {
            setObituaries(preObits);
        }
    }, [id]);


    useEffect(() => {
        const fetchObituaries = async () => {
            try {
                const response = await fetch('https://vunmenyrzojt43cpzelrjfbira0lysbc.lambda-url.ca-central-1.on.aws');
                const data = await response.json();
                setObituaries(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchObituaries();
    }, []);



      

    function incrementCount() {
        setCount(count + 1);
    } 
    
    const OnAddObituary = async (e) => {
        setIsClicked(true);
        if (imgAdded && changeBorn){
            let index = 0;
            let i = 0;
            
            if(diedDate === "") {
                setDiedDate(isoString)
            }
            if (isInputEdited){
                document.getElementById("writeObituary").setAttribute("id", "newId");
                setClick(true)
                incrementCount()
                const newObituary={
                    id: id,
                    name: name,
                    image: image,
                    bornDate: bornDate,
                    diedDate: diedDate
                };
                const preObits = JSON.parse(localStorage.getItem("obituaries"));
                var newObits;
                if(preObits) {
                    newObits = [...preObits, newObituary];
                }else{
                newObits = [newObituary];
                }
                localStorage.setItem("obituaries", JSON.stringify(newObits))
                setObituaries([newObituary, ...obituaries]);            //  This line of code needs to be moved to after the chat gpt get is finished!
                const data = new FormData()
                data.append('file', file)
                data.append('name', name)
                data.append('bornDate', bornDate)
                data.append('diedDate', diedDate)
                data.append('id', id)
                const promise = await fetch (
                    "https://5fr5u5oie2fn4fu6nt6vimqouu0pjuiw.lambda-url.ca-central-1.on.aws",
                    {
                        method: "POST",
                        body: data,
                    }
                )
                
                const promise2 = await fetch(`https://vunmenyrzojt43cpzelrjfbira0lysbc.lambda-url.ca-central-1.on.aws`)
                if (promise2.status === 200) {
                    const notes = await promise2.json();
                    for(i; i< notes.length; i++) {
                        if(notes[i].name === name){
                            index = i
                        }
                    }
                    setImage(notes[index].image_url)
                    setObituaries(notes)
                
                    onAddCard(notes[index].obituary, notes[index].audio_url, notes[index].image_url)
                    setAddingObituary(false)
                }
            

   
            }
                
            
        }   
    }

    const onChangeBornDate = () => {
        const dateInput = document.getElementById("date1");
        setChangeBorn(true)
        dateInput.addEventListener("change", (event) => {
            const input = event.target.value;
            setBornDate(input);
            const day = new Date(input).getDate()
            const month = new Date(input).getMonth();
            const year = new Date(input).getFullYear()
            const monthName = monthNames[month]; 
            setBirthdayString(`${monthName} ${day}, ${year}`);
          });
    } 

    const onChangeDiedDate = () => {
        const dateInput = document.getElementById("date2");
        dateInput.addEventListener("change", (event) => {
            const input = event.target.value;
            setDiedDate(input)
            const day = new Date(input).getDate()
            const month = new Date(input).getMonth();
            const year = new Date(input).getFullYear()
            const monthName = monthNames[month]; 
            setDeathString(`${monthName} ${day}, ${year}`);
          });

    } 

    const handleInputChange = (event) => {
        const input = event.target;
        if (input.value !== "") {
            setIsInputEdited(true);
            setClick(false)
            setName(input.value)
        }
        else {
            setIsInputEdited(false);
            setIsClicked(false)
            setClick(false)
        }
        
    };

    const onFileChange = (e) => {
        const input = e.target;
        const label = input.parentElement;
        const fileName = input.files[0].name;
        label.textContent = `Select an image for the deceased(${fileName})`;
        setImage(URL.createObjectURL(e.target.files[0]));
        setFile(e.target.files[0])
        setId(uuid())
        setImgAdded(true)    
    }

    const onAddCard = (newCardBody, audio, image) => {
        const parts = image.split('upload/')
        const newUrl  = parts[0] + 'upload/e_art:zorro/' + parts[1]
        console.log(newUrl)
        setCards(cards.concat(<NewCard index={cards.length} newCardBody={newCardBody} audio={audio} imgOpen={false} newUrl={newUrl} />));
    }
    

    const NewCard = ({ index, newCardBody, audio, imgOpen , newUrl}) => {
        const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
        const cardWidth = viewportWidth <= 0.66 * window.screen.width ? viewportWidth <= 0.35 * window.screen.width ? '68%': '34%' : '16.8%';
        const cardSpace = viewportWidth <= 0.66 * window.screen.width ? viewportWidth <= 0.35 * window.screen.width ? '14%': '7%' : '4%';
        const [imgClick, setImgClick] = useState(imgOpen);
        const [audioObj, setAudioObj] = useState(null);
        const [isPlaying, setIsPlaying] = useState(false);
        const [icon, setIcon] = useState('play');
        const [cardBody, setCardBody] = useState(newCardBody);
        const [lastImage, setLastImage] = useState(newUrl)
        console.log(index)
        useEffect(() => {
            const handleResize = () => setViewportWidth(window.innerWidth);
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
          }, []);
      
        useEffect(() => {
          setAudioObj(new Audio(audio));
        }, [audio]);
      
        function handleClick() {
          if (!isPlaying) {
            audioObj.play();
            setIsPlaying(true);
            setIcon('pause');
          } else {
            audioObj.pause();
            setIsPlaying(false);
            setIcon('play');
          }
        }
      
        useEffect(() => {
          const handleAudioEnd = () => {
            setIsPlaying(false);
            setIcon('play');
          };
      
          if (audioObj) {
            audioObj.addEventListener('ended', handleAudioEnd);
            return () => audioObj.removeEventListener('ended', handleAudioEnd);
          }
        }, [audioObj]);
       

        return (
            <Card style={{ width: cardWidth, marginRight: cardSpace, marginLeft: cardSpace, marginTop: '20px', height: '100%' }}>
                <Card.Img variant="top" src={lastImage} onClick={() => setImgClick(!imgClick)}/>
                <Card.Body >
                <Card.Title>{name}</Card.Title>
                <Card.Subtitle style={{fontSize: '11px', color: 'grey'}}>{`${birthdayString} - ${deathString}`}</Card.Subtitle>
                <div style={{ display: imgClick ? 'block' : 'none' }}>
                    <Card.Text>
                    <p></p>
                    {cardBody}
                    </Card.Text>
                    <Button 
                        style={{backgroundColor: 'lightGrey', radius: '20px', borderColor: 'darkGrey'}}
                        variant="primary" 
                        className="rounded-circle"
                        onClick={handleClick}>{icon === "play" ? "Play" : "Pause"}
                    </Button>
                </div>
            </Card.Body>
            </Card>
          );
      };


    if (obituaries.length === 0 && !addingObituary){
    return (
        <div style={bodyWrapper}>
            <h3 id="noObituary">
                No Obituary Yet.
            </h3>
        </div> 
    )
    }
    if (addingObituary){
    return(
        <div>
            <div  id="x">
                <button id="exit" onClick={exit}>x</button>
            </div>
            <div style={newObit}>
                <h2 id="createanewobituary">Create a New Obituary</h2>
                <img src="https://static.vecteezy.com/system/resources/previews/007/022/869/original/floral-elements-design-luxury-ornamental-graphic-element-border-swirls-flowers-foliage-swirl-decorative-design-for-page-decoration-cards-wedding-banner-logos-frames-labels-cafes-boutiques-free-vector.jpg" id="flower" alt="Sorry for your loss"></img>

                <form>
                    <label for="file-upload" class="file-upload">
                         Select an image for the deceased
                    </label>
                    <input id="file-upload" type="file" onChange={(e) =>onFileChange(e)}/>
                </form>
                {isClicked && !imgAdded && <p className="missing" >Please fill out this field.</p>}
                <input type="text" id="name-input" placeholder="Name of the deceased" onChange={handleInputChange}></input>
                {isClicked && !isInputEdited && <p className="missing">Please fill out this field.</p>}
                <div style={dates}>
                    <div style={dates}>
                        <p><i>Born:</i></p>
                        <input 
                            id="date1" 
                            type="datetime-local"
                            onClick={onChangeBornDate}/>
                    </div>
                    <div>
                        <p id="weBadAtCSS">____</p>
                    </div>
                    <div style={dates}> 
                        <p><i>Died:</i></p>
                        <input 
                            id="date2" 
                            type="datetime-local" 
                            defaultValue={isoString}
                            onClick={onChangeDiedDate}/>
                    </div>
                </div>
                {isClicked && !changeBorn && <p className="missing">Please fill out this field.</p>}
                
                <button id="writeObituary" onClick={OnAddObituary}>{click && isInputEdited && imgAdded && changeBorn ? "Please wait. It's not like they're going to be late for something ...": "Write Obituary" }</button>
                
            </div>
        </div>
    )
    }
    if (!addingObituary && isInputEdited){
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
           {cards}
        </div>
      );
    }
}

export default Body;


