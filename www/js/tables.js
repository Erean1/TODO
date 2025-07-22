export async function loadTable(type, dataType) {
  const res = await fetch(`/api/tables/${type}`);
  const tableJson = await res.json();

  const dataRes = await fetch(`/api/${dataType}`);
  const datas = await dataRes.json();

  let tableId = null;
  switch (dataType) {
    case "myTodos":
      tableId = "#todoTable";
      break;
    case "userList":
      tableId = "#userTable";
      break;
    case "logs":
      tableId = "#logTable"
      break;
  }
  if (dataType === "userList") {
    tableJson.columns.push({
      data: null,
      title: "işlemler",
      orderable: false,
      searchable: false,
      render: function (data, type, row) {
        return `
                    <a type="button" href="/user-edit/${row._id}" class= "btn btn-success btn-sm action-btn" data-id="${row._id}" data-type="update">Edit</a>
                `;
      },
    });
  } else if(dataType === "myTodos") {
    tableJson.columns.push({
      data: null,
      title: "işlemler",
      orderable: false,
      searchable: false,
      render: function (data, type, row) {
        if (row.done === true) {
          return `
              <button class= "btn btn-warning btn-sm action-btn" data-id="${row._id}" data-type="open"><i class="bi bi-opencollective"></i></button>
              <button class= "btn btn-danger btn-sm action-btn" data-id="${row._id}" data-type="trash"><i class="bi bi-trash-fill"></i></button>
                `;
        }

        return `
            <a type="button"  href="/edit/${row._id}" class="btn btn-primary btn-sm action-btn" data-id="${row._id}" data-type="update"><i class="bi bi-pencil"></i></a>
            <button class="btn btn-success btn-sm action-btn" data-id="${row._id}" data-type="complete"> <i class="bi bi-check-circle"></i></button>
            <a  type="button" href="/schedule/${row._id}"  class= "btn btn-secondary btn-sm action-btn" data-id="${row._id}" data-type="schedule"><i class="bi bi-calendar"></i></a>
            <button class= "btn btn-danger btn-sm action-btn" data-id="${row._id}" data-type="trash"><i class="bi bi-trash-fill"></i></button>
            `;
      },
    });
  }

  $(tableId).DataTable({
    ordering: true,
    columns: tableJson.columns,
    data: datas,
  });
}

$(document).on("click", "button.action-btn", async function () {
  const id = $(this).data("id");
  const type = $(this).data("type");  

  try {
    const res = await fetch(`/api/operation/${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: id }),
    });
    const json = await res.json();
    console.log(json);

    if (json.success === true) {
      if ($.fn.DataTable.isDataTable("#todoTable")) {
        $("#todoTable").DataTable().clear().destroy();
      }
      await loadTable("todo-table", "myTodos");
      return;
    }
  } catch (err) {
    console.error("İşlem Başarısız", err);
  }
});
