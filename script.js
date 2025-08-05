const API_URL = 'https://script.google.com/macros/library/d/1-0StD8pr7JF5SIp__fVkdXVneUy2R8YWMcQEchSa8nlR5Twqo7tjLB0-/1';

document.addEventListener('DOMContentLoaded', fetchData);

function fetchData() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById('data-table');
      table.innerHTML = '';
      data.forEach(row => {
        table.innerHTML += `
          <tr>
            <td>${row.ID}</td>
            <td>${row.NAMA}</td>
            <td>${row.USERNAME}</td>
            <td>${row.LEVEL}</td>
            <td>
              <button class="edit" onclick='editData(${JSON.stringify(row)})'>Edit</button>
              <button class="delete" onclick="deleteData('${row.ID}')">Hapus</button>
            </td>
          </tr>
        `;
      });
    })
    .catch(error => console.error('Fetch Error:', error));
}

function createData() {
  const nama = document.getElementById('nama').value;
  const username = document.getElementById('username').value;
  const level = document.getElementById('level').value;

  if (!nama || !username || !level) {
    alert('Lengkapi data terlebih dahulu');
    return;
  }

  const id = Date.now().toString();

  fetch(API_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: convertToFormData({
      action: 'create',
      ID: id,
      NAMA: nama,
      USERNAME: username,
      LEVEL: level
    }),
    redirect: 'follow'
  })
  .then(res => res.text())
  .then(txt => {
    console.log('Response:', txt);
    const response = JSON.parse(txt);
    alert(response.message);
    fetchData();
    clearForm();
  })
  .catch(error => console.error('Fetch Error:', error));
}

function updateData() {
  const id = document.getElementById('id').value;
  const nama = document.getElementById('nama').value;
  const username = document.getElementById('username').value;
  const level = document.getElementById('level').value;

  if (!id) {
    alert('Pilih data yang akan di-update');
    return;
  }

  fetch(API_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: convertToFormData({
      action: 'update',
      ID: id,
      NAMA: nama,
      USERNAME: username,
      LEVEL: level
    }),
    redirect: 'follow'
  })
  .then(res => res.text())
  .then(txt => {
    const response = JSON.parse(txt);
    alert(response.message);
    fetchData();
    clearForm();
  })
  .catch(error => console.error('Fetch Error:', error));
}

function deleteData(id) {
  if (confirm('Yakin ingin menghapus data ini?')) {
    fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: convertToFormData({
        action: 'delete',
        ID: id
      }),
      redirect: 'follow'
    })
    .then(res => res.text())
    .then(txt => {
      const response = JSON.parse(txt);
      alert(response.message);
      fetchData();
    })
    .catch(error => console.error('Fetch Error:', error));
  }
}

function editData(row) {
  document.getElementById('id').value = row.ID;
  document.getElementById('nama').value = row.NAMA;
  document.getElementById('username').value = row.USERNAME;
  document.getElementById('level').value = row.LEVEL;
}

function clearForm() {
  document.getElementById('id').value = '';
  document.getElementById('nama').value = '';
  document.getElementById('username').value = '';
  document.getElementById('level').value = '';
}

function convertToFormData(obj) {
  const formData = new URLSearchParams();
  for (const key in obj) {
    formData.append(key, obj[key]);
  }
  return formData;
}
