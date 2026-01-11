export class TodoService{
  static API_URL = '/api/todo'
  async remove(id) {
        return await fetch(`${TodoService.API_URL}?id=${id}`, {
        method: 'DELETE'
    });    
  }

  async getAll(){
    return await fetch(TodoService.API_URL).then(result => result.json());;
  }

  async add(text){
    return await fetch(TodoService.API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({value: text})
        }).then(result=>result.json());
    }
}

export default new TodoService();