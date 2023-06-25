import React, { useState, useEffect } from "react";
import styles from "./List.module.css";

const List = () => {

  const [inputValueUser, setinputValueUser] = useState("");
  const [inputValueLogin, setinputValueLogin] = useState("");
  const [inputValue, setinputValue] = useState("");
  const [items, setItems] = useState([{label: "No tasks, add one", done: false}]);

  // useEffect(() => {createUser()}, [])
  // useEffect(() => {getData()}, [])

  //CREAMOS USUARIO
  const handleKeyPressUser = async (event) => {
    if (event.key === "Enter") {
      await createUser();
    }
  };

  const createUser = async () => {
    try {
      const url = `https://assets.breatheco.de/apis/fake/todos/user/${inputValueUser}`
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify([])
      })
      if (!response.ok) {
        throw new Error("Error request")
      }
      const result = await response.json()
      console.log("Respuesta", result)

    } catch (error) {
      console.log("Creating User Error: ", error)
    }
  }

  //CARGAMOS INFORMACION DE BASE DE DATOS EN CASO DE USUARIO YA EXISTENTE
  const handleKeyPressLogin = async (event) => {
    if (event.key === "Enter") {
      await getData();
    }
  };
  const getData = async () => {
    try {
      const url = `https://assets.breatheco.de/apis/fake/todos/user/${inputValueLogin}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Error request")
      }
      const result = await response.json()
      setItems(result)
    } catch (error) {
      console.log("Charging data error:", error)
    }
  }

  //CODIGO DE CONTROL DE TAREAS (AGREGAR, BORRAR)
  const agregarItem = () => {
    if (items[0].label == "No tasks, add one" & inputValue !== "") {
      setItems(items.shift());
      setItems([inputValue])
    }
    if (inputValue !== "") {
      setItems([...items, {label: inputValue, done: false}]);
      setinputValue("")
    }
  };

  const handleKeyPressItem = async (event) => {
    if (event.key === "Enter") {
      await agregarItem();
    }
  };

  const deleteValue = (index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
    if (items.length == 0) {
      setItems([{label: "No tasks, add one", done: false}])
    }
  };

  useEffect(() => {
    if (items.length === 0) {
      setItems([{label: "No tasks, add one", done: false}]);
    }
  }, [items]);

  const deleteAllItems = () => {
    setItems([{label: "No tasks, add one", done: false}])
  }

  //SUBIMOS INFORMACION

  const postData = async () => {
    try {
      let url = ""
      if(inputValueLogin == ""){
        url = `https://assets.breatheco.de/apis/fake/todos/user/${inputValueUser}`
      }else{
        url = `https://assets.breatheco.de/apis/fake/todos/user/${inputValueLogin}`
      }
      const response = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(items),
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (!response.ok) {
        throw new Error("Uploading error")
      }
      const result = await response.json()
      console.log("Result: ", result)
    } catch (error) {
      console.log("Uploading error: ", error)
    }
  }

  return (
    <div className={styles.generalDiv}>
      <h1 className={styles.todolist}>To Do List</h1>
      <div>
        <input
          className={styles.inputs}
          type="text"
          onKeyDown={(e) => handleKeyPressUser(e)}
          value={inputValueUser}
          onChange={(e) => setinputValueUser(e.target.value)}
          placeholder="Username"
        />
        <button className={styles.btnAdd} onClick={createUser}>Create User</button>
      </div>
      <div>
        <input
          className={styles.inputs}
          type="text"
          onKeyDown={(e) => handleKeyPressLogin(e)}
          value={inputValueLogin}
          onChange={(e) => setinputValueLogin(e.target.value)}
          placeholder="Username"
        />
        <button className={styles.btnAdd} onClick={getData}>Log in</button>
      </div>
      <h3 className={styles.tasks}><strong>Tasks</strong></h3>
      <div className={styles.firstDiv}>
        <input
          className={styles.inputs}
          type="text"
          onKeyDown={(e) => handleKeyPressItem(e)}
          value={inputValue}
          onChange={(e) => setinputValue(e.target.value)}
          placeholder="Task to add"
        />
        <button className={styles.btnAdd} onClick={agregarItem}>Add</button>

      </div>
      <ul className={styles.ul}>
        {items.map((value, index) => {
          return <li
            key={index}
            className={styles.li}>{value.label}
            <i
              onClick={() => deleteValue(index)}
              className="fa-solid fa-rectangle-xmark mt-1"></i></li>;
        })}
      </ul>
      <div className={styles.deleteAll}>
        <button className={styles.btnDelete} onClick={deleteAllItems}>Delete all</button>
      </div>
      <div className={styles.deleteAll}>
        <button className={styles.btnDelete} onClick={postData}>Update</button>
      </div>
    </div>
  );
};

export default List;



