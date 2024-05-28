const { nanoid } = require('nanoid');
const books = require('./books');

//Kriteria 3 : API dapat menyimpan buku
const addBooksHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;
    const newBooks = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    books.push(newBooks);

    const isSuccess = books.filter((books) => books.id === id).length > 0;

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400)
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400)
        return response;
    }

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                booksId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};


//Kriteria 4 : API dapat menampilkan seluruh buku
const getAllBooksHandler = () => ({
    status: 'success',
    data: {
        books: books.map(book => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher
        }))
        // books,
    }
});


// Kriteria 5 : API dapat menampilkan detail buku
const getBooksByIdHandler = (request, h) => {
    const { id } = request.params;
    const book = books.find((book) => book.id === id);
    if (book) {
        return h.response({
            status: 'success',
            data: {
                book,
            },
        }).code(200);
    } else {
        return h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        }).code(404);
    }
};

//Kriteria 6 : API dapat mengubah data buku
const editBooksByIdHandler = (request, h) => {
    const { id } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading, title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((books) => books.id === id);
    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            title,
            tags,
            body,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};


const deleteBooksByIdHandler = (request, h) => {
    const { id } = request.params;
    const index = books.findIndex((Books) => Books.id === id);
    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addBooksHandler,
    getAllBooksHandler,
    getBooksByIdHandler,
    editBooksByIdHandler,
    deleteBooksByIdHandler,
};