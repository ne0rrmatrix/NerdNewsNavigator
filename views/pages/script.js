

renderTable = () =>
{
    let table = document.createElement("table");
    let tbody = document.createElement("tbody");
    let tr = document.createElement("tr");
    let arr = ["Show Name","Episode number"]
    for (const element of arr)
    {
        let th = document.createElement('th');
        let text = document.createTextNode(element);
        th.appendChild(text);
        tr.appendChild(th);
        tbody.appendChild(tr);
    }

}