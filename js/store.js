import { emptyItemQuery } from './item.js';

export default class Store {

	constructor(name, callback) {
		const localStorage = window.localStorage;

		let liveTodos;

		this.getLocalStorage = () => {
			return liveTodos || JSON.parse(localStorage.getItem(name) || '[]');
		};

		this.setLocalStorage = (todos) => {
			localStorage.setItem(name, JSON.stringify(liveTodos = todos));
		};

		if (callback) {
			callback();
		}
	}

	find(query, callback) {
		const todos = this.getLocalStorage();

		callback(todos.filter(todo => {
			for (let k in query) {
				if (query[k] !== todo[k]) {
					return false;
				}
			}
			return true;
		}));
	}

	update(update, callback) {
		const id = update.id;
		const todos = this.getLocalStorage();
		let i = todos.length;

		while (i--) {
			if (todos[i].id === id) {
				for (let k in update) {
					todos[i][k] = update[k];
				}
				break;
			}
		}

		this.setLocalStorage(todos);

		if (callback) {
			callback();
		}
	}

	insert(item, callback) {
		const todos = this.getLocalStorage();
		if (todos.findIndex(val => val.title === item.title) === -1) {
			todos.push(item);
		} else {
			alert("item already exists")
		}

		this.setLocalStorage(todos);

		if (callback) {
			callback();
		}
	}

	remove(query, callback) {
		console.log("query", query)
		const todos = this.getLocalStorage().filter(todo => {
			for (let k in query) {
				if (query[k] === todo[k]) {
					return true;
				}
			}
			return false;
		});

		this.setLocalStorage(todos);

		if (callback) {
			callback(todos);
		}
	}

	count(callback) {
		this.find(emptyItemQuery, data => {
			const total = data.length;

			let i = total;
			let completed = 0;

			while (i--) {
				completed += data[i].completed;
			}
			callback(total, total - completed, completed);
		});
	}
}
