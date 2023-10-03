
const headerWrapper  = {
    flex: "30%",
    display: "flex",
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: "2px solid #f2f2f2f5",
    position: "relative"
};

const headerWrapperButton = {
    flex: "10%",
    display: "block",
    height: "100%",
    justifyContent: "center",
    top: "0",
    bottom: "0",
    margin: "10px",
    textAlign: "center",
}

const headerWrapperTitle = {
    flex: "80%",
    display: "flex",
    justifyContent: "center",


};

const Header = ({addingObituary, newObituary}) => {
    if(!addingObituary)
    return (
        <div style={headerWrapper}>
            <div id="hiddenButton" style={headerWrapperButton}>
                <h4 >
                    + New Obituary
                </h4>
            </div>
            <div style={headerWrapperTitle}>
                <h1 id="title">
                    The Last Show
                </h1>
            </div>
            <div id="container">
                <div id="newButton" style={headerWrapperButton} onClick={() => newObituary()}>
                    <h4 >
                        + New Obituary
                    </h4>
                </div>
            </div>
        </div>
    )
    return(
        <div></div>
    )
}



export default Header;