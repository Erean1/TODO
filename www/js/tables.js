export async function loadTable(type, dataType) {
  const res = await fetch(`/api/tables/${type}`); // table.json u çektik
  const tableJson = await res.json(); // değişkene atadık

  const dataRes = await fetch(`/api/${dataType}`); //tabloda göstereceğim datalar
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
      tableId = "#logTable";
      break;
    case "completedTodos":
      tableId = "#completedTodos";
      break;
    case "categoryList":
      tableId = "#categoryTable";
      break;
  }
  if (dataType === "userList") {
    tableJson.columns.push({
      // tablenin columns listesine push islemi
      data: null, // datası null
      title: "işlemler", // titlesi
      orderable: false, // sıralanabilirlik
      searchable: false, // aranabilirlik
      render: function (data, type, row) {
        return `
                    <a type="button" href="/user-edit/${row._id}" class= "btn btn-success btn-sm action-btn" data-id="${row._id}" data-type="update">Edit</a>
                `;
      },
    });
  } else if (dataType === "myTodos") {
    document.getElementById("todoCount").innerText = `Toplam Görev Sayısı : ${datas.count}` 

    tableJson.columns.push({
      data: null,
      title: "işlemler",
      orderable: false,
      searchable: false,
      render: function (data, type, row) {
        return `
            <a type="button"  href="/edit/${row._id}" class="btn btn-primary btn-sm action-btn" data-id="${row._id}" data-type="update" data-table-id="todoTable"><i class="bi bi-pencil"></i></a>
            <button class="btn btn-success btn-sm action-btn" data-id="${row._id}" data-type="complete" data-table-id="todoTable"> <i class="bi bi-check-circle"></i></button>
            <a  type="button" href="/schedule/${row._id}"  class= "btn btn-secondary btn-sm action-btn" data-id="${row._id}" data-type="schedule" data-table-id="todoTable"><i class="bi bi-calendar"></i></a>
            <button class= "btn btn-danger btn-sm action-btn" data-id="${row._id}" data-type="trash" data-table-id="todoTable"><i class="bi bi-trash-fill"></i></button>
            `;
      },
    });
  } else if (dataType === "completedTodos") {
    tableJson.columns.push({
      data: null,
      title: "işlemler",
      orderable: false,
      searchable: false,
      render: function (data, type, row) {
        if (row.done === true) {
          return `
              <button class= "btn btn-warning btn-sm action-btn" data-id="${row._id}" data-type="open" data-table-id="completedTodos"><i class="bi bi-opencollective"></i></button>
              <button class= "btn btn-danger btn-sm action-btn" data-id="${row._id}" data-type="trash" data-table-id="completedTodos"><i class="bi bi-trash-fill"></i></button>
                `;
        }
      },
    });
  } else if (dataType === "categoryList") {
    tableJson.columns.push({
      data: null,
      title: "işlemler",
      orderable: false,
      searchable: false,
      render: function (data, type, row) {
        return `
              <button class= "btn btn-danger btn-sm action-btn" data-id="${row._id}" data-type="delete" data-table-id="categoryTable"><i class="bi bi-trash-fill"></i></button>
                `;
      },
    });
  }

  $(tableId).DataTable({
    ordering: true,
    columns: tableJson.columns,
    data: datas.data ? datas.data : datas,
  });
}

$(document).on("click", "button.action-btn", async function () { // documentte button.actio-btn içerenlerde click olayı gerçekleşince bir callback 
  // fonksiyonu çalıştır
  // action-btn olan butonlara cilck eventi ekledik
  const id = $(this).data("id"); // data-id diye tanımladık  butonlara onu cektik this.data ile
  const type = $(this).data("type"); // date-type olanları
  const tableType = $(this).data("tableId"); // date-tableId olanları

  try {
    if (tableType === "categoryTable") {
      const res = await fetch(`/api/category-operation/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      const json = await res.json();
      if (json.success === true) {
        if ($.fn.DataTable.isDataTable("#categoryTable")) {
          $("#categoryTable").DataTable().clear().destroy();
        }
        await loadTable("category-table", "categoryList");
        return;
      }
    } else {
      const res = await fetch(`/api/operation/${type}`, {
        // type göre apiye istek done , trash vs
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: id }),
      });
      const json = await res.json();

      if (json.success === true) {
        if (tableType === "todoTable") {
          if ($.fn.DataTable.isDataTable("#todoTable")) {
            $("#todoTable").DataTable().clear().destroy();
          }
          await loadTable("todo-table", "myTodos");
          return;
        } else if (tableType === "completedTodos") {
          if ($.fn.DataTable.isDataTable("#completedTodos")) {
            // tablo önceden başlatılmış mı
            $("#completedTodos").DataTable().clear().destroy(); // tabloyu siler
          }
          await loadTable("completedTodos-table", "completedTodos"); // tabloyu yeniden yükler her aksiyon işleminden sonra
          return;
        }
      }
    }
  } catch (err) {
    console.error("İşlem Başarısız", err);
  }
});
