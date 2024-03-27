const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNotes = {
    id, title, tags, body, createdAt, updatedAt,
  };
  notes.push(newNotes);

  const isSuccess = notes.some((note) => note.id === id);
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan.',
      data: {
        noteId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan.',
  });

  response.code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const existingNote = notes.find((note) => note.id === id);
  if (existingNote !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        note: existingNote,
      },
    });
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);
  if (index >= 0) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbaharui',
    });

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id catatan tidak ditemukan',
  });

  response.code(404);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);
  if (index >= 0) {
    notes.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbaharui',
    });

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
