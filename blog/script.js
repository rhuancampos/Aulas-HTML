async function carregarPosts() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');

      if (!response.ok) {
        throw new Error('Erro ao buscar posts');
      }

      const posts = await response.json();
      const container = document.getElementById('posts');

      posts.forEach(post => {
        const div = document.createElement('div');
        div.classList.add('post');

        div.innerHTML = `
          <h2>${post.title}</h2>
          <p>${post.body}</p>
        `;

        container.appendChild(div);
      });

    } catch (error) {
      console.error(error);
    }
  }

carregarPosts()