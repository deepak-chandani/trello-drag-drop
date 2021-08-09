export default function addGlobalEventListener(type, selector, listener) {
    document.addEventListener(type, (e) => {
        if(e.target.matches(selector)){
            listener(e);
        }
    })
}