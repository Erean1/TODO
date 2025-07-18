export async function loadTable(type,dataType){
    const res = await fetch(`/api/tables/${type}`);
    const tableJson = await res.json();

    const dataRes = await fetch(`/api/${dataType}`);
    const datas = await dataRes.json()

    let tableId = null;
    switch (dataType){
        case "myTodos":
            tableId = "#todoTable"
            break;
        case "users":
            tableId = "#userTable"
            break;
    }
 


    $(tableId).DataTable({
        ordering : true,
        columns : tableJson.columns,
        data : datas
    })
}