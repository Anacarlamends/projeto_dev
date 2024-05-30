document.addEventListener('DOMContentLoaded', (event) => {
    const agendarButton = document.getElementById('agendarPessoa');
    const modal = document.getElementById('dados');
    const closeModal = document.getElementById('modalClose');
    const salvarButton = document.getElementById('salvar');
    const cancelarButton = document.getElementById('cancelar');
    const form = document.getElementById('form');
    const tableBody = document.querySelector('#tablePessoa tbody');
    const formContent = document.querySelector('.modal-content');
  
    let currentRow = null;
  
    const showModal = () => {
      modal.style.display = 'block';
      centerModal();
    };
  
    const hideModal = () => {
      modal.style.display = 'none';
    };
  
    const addReservationToTable = (name, date, time, lab) => {
      const [year, month, day] = date.split('-');
      const formattedDate = `${day}/${month}/${year}`;
  
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${name}</td>
        <td>${formattedDate}</td>
        <td>${time}</td>
        <td>${lab}</td>
        <td>
          <button class="button green edit">Editar</button>
          <button class="button red delete">Excluir</button>
        </td>
      `;
      tableBody.appendChild(row);
  
      attachEventListeners(row);
    };
  
    const attachEventListeners = (row) => {
      const name = row.cells[0].textContent;
      const date = row.cells[1].textContent.split('/').reverse().join('-'); // Reformatting to yyyy-mm-dd
      const time = row.cells[2].textContent;
      const lab = row.cells[3].textContent;
  
      row.querySelector('.edit').addEventListener('click', () => {
        editReservation(name, date, time, lab, row);
      });
  
      row.querySelector('.delete').addEventListener('click', () => {
        deleteReservation(row);
      });
    };
  
    const editReservation = (name, date, time, lab, row) => {
      document.getElementById('nome').value = name;
      document.getElementById('data').value = date;
      document.getElementById('time').value = time;
      document.getElementById('labs').value = lab;
  
      currentRow = row;
      showModal();
    };
  
    const deleteReservation = (row) => {
      const name = row.cells[0].textContent;
      const confirmed = confirm(`Tem certeza que deseja excluir a reserva de ${name}?`);
      
      if (confirmed) {
        row.remove();
      }
    };
  
    const updateReservationInTable = (name, date, time, lab) => {
      const [year, month, day] = date.split('-');
      const formattedDate = `${day}/${month}/${year}`;
  
      currentRow.innerHTML = `
        <td>${name}</td>
        <td>${formattedDate}</td>
        <td>${time}</td>
        <td>${lab}</td>
        <td>
          <button class="button green edit">Editar</button>
          <button class="button red delete">Excluir</button>
        </td>
      `;
  
      attachEventListeners(currentRow);
      currentRow = null;
    };
  
    const clearForm = () => {
      form.reset();
      document.querySelectorAll('.form-block span[role="alert"]').forEach(span => {
        span.style.display = 'none';
      });
    };
  
    const centerModal = () => {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const modalHeight = formContent.offsetHeight;
      const modalWidth = formContent.offsetWidth;
  
      formContent.style.top = `${(windowHeight - modalHeight) / 2}px`;
      formContent.style.left = `${(windowWidth - modalWidth) / 2}px`;
    };
  
    agendarButton.addEventListener('click', () => {
      currentRow = null;
      showModal();
    });
  
    closeModal.addEventListener('click', hideModal);
  
    cancelarButton.addEventListener('click', () => {
      hideModal();
      clearForm();
    });
  
    form.addEventListener('submit', (event) => {
      event.preventDefault();
  
      const name = document.getElementById('nome').value.trim();
      const date = document.getElementById('data').value.trim();
      const time = document.getElementById('time').value.trim();
      const lab = document.getElementById('labs').value.trim();
  
      let hasError = false;
  
      if (!name) {
        document.getElementById('nameError').style.display = 'block';
        hasError = true;
      } else {
        document.getElementById('nameError').style.display = 'none';
      }
  
      if (!date) {
        document.getElementById('dataError').style.display = 'block';
        hasError = true;
      } else {
        document.getElementById('dataError').style.display = 'none';
      }
  
      if (!time) {
        document.getElementById('horarioError').style.display = 'block';
        hasError = true;
      } else {
        document.getElementById('horarioError').style.display = 'none';
      }
  
      if (lab === 'selecione') {
        document.getElementById('salaError').style.display = 'block';
        hasError = true;
      } else {
        document.getElementById('salaError').style.display = 'none';
      }
  
      if (!hasError) {
        if (currentRow) {
          updateReservationInTable(name, date, time, lab);
        } else {
          addReservationToTable(name, date, time, lab);
        }
        hideModal();
        clearForm();
      }
    });
  
    salvarButton.addEventListener('click', () => {
      form.dispatchEvent(new Event('submit'));
    });
  
    window.addEventListener('resize', centerModal);
  });
