import axios from "axios"

export const handleOpenWindows = () => {
    axios.get(`${window.App_Config.API_Base_URL}login?UserEmail=dl_azure@delphianlogic.com`)
        .then(res => {
            let newWindow = window.open(res.data, '_blank', 'width=400,height=300,top=100,left=100,resizable=no');
            // setTimeout(() => {
            //     newWindow.close();
            //     handleGetChatToken();
            // }, 5000);
        })
}

export const handleCloseWindows = () => {
    window.close();
    handleGetChatToken()
}

export const handleGetChatToken = (topic) => {
    let code = localStorage.getItem('code')
    axios.post(`${window.App_Config.API_Base_URL}get-token?authorizationCode=${code}`)
    .then(res => {
        // handleCreateRoom(topic);
    })
} 

export const handleCreateRoom = (topic) => {
    let emails = "prashant.sawant@zurich.com,shashikant.gundewar@uk.zurich.com,Jayesh.bhavsar@zurich.com,jessica.loveday@delphianlogic.com"
    axios.get(`${window.App_Config.API_Base_URL}create-chat-group?emails=${emails}&chatTopic=${topic}`)
    .then(res => {
        console.log(res);
    })
}