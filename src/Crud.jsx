import { useState, useEffect } from "react";

export default function Crud() {
  // Stato per memorizzare la lista degli utenti
  const [users, setUsers] = useState([]);
  // Stato per gestire i dati del nuovo utente da creare
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user" });
  // Stato per gestire l'utente in fase di modifica
  const [editingUser, setEditingUser] = useState(null);

  // Effetto che si attiva al montaggio del componente per caricare gli utenti
  useEffect(() => {
    getUtenti();
  }, []);

  // Funzione per ottenere la lista degli utenti dal server
  const getUtenti = () => {
    fetch("http://localhost:5001/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Errore nella richiesta:", error));
  };

  // Funzione per creare un nuovo utente
  const creaUtente = (e) => {
    e.preventDefault();
    fetch("http://localhost:5001/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((createdUser) => {
        // Aggiorna lo stato locale aggiungendo il nuovo utente
        setUsers([...users, createdUser]);
        // Resetta il form per il nuovo utente
        setNewUser({ name: "", email: "", role: "user" });
      })
      .catch((error) => console.error("Errore nella creazione:", error));
  };

  // Funzione per eliminare un utente
  const cancellaUtente = (id) => {
    fetch(`http://localhost:5001/api/users/${id}`, { method: "DELETE" })
      .then(() => {
        // Aggiorna lo stato locale rimuovendo l'utente eliminato
        setUsers(users.filter((user) => user._id !== id));
      })
      .catch((error) => console.error("Errore nell'eliminazione:", error));
  };

  // Funzione per modificare un utente esistente
  const modificaUtente = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5001/api/users/${editingUser._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingUser),
    })
      .then(() => {
        // Aggiorna lo stato locale sostituendo l'utente modificato
        setUsers(
          users.map((user) =>
            user._id === editingUser._id ? editingUser : user,
          ),
        );
        // Resetta lo stato di modifica
        setEditingUser(null);
      })
      .catch((error) => console.error("Errore nell'aggiornamento:", error));
  };

  return (
    <div>
      <h2>Crea Nuovo Utente</h2>
      {/* Form per la creazione di un nuovo utente */}
      <form onSubmit={creaUtente}>
        <input
          type="text"
          placeholder="Nome"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Crea Utente</button>
      </form>

      <h2>Lista Utenti</h2>
      {/* Lista degli utenti con opzioni per modificare ed eliminare */}
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            Nome: {user.name} - Ruolo: {user.role} - Email: {user.email}
            <button onClick={() => setEditingUser(user)}>Modifica</button>
            <button onClick={() => cancellaUtente(user._id)}>Elimina</button>
            {/* Form di modifica che appare solo per l'utente selezionato */}
            {editingUser && editingUser._id === user._id && (
              <form onSubmit={modificaUtente}>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  required
                />
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button type="submit">Salva Modifiche</button>
                <button type="button" onClick={() => setEditingUser(null)}>
                  Annulla
                </button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
