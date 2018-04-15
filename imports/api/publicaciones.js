import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Publicaciones = new Mongo.Collection("libros");
export const Comentarios = new Mongo.Collection("Comentarios");

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("publicaciones", function () {
    return Publicaciones.find({});
  });
  Meteor.publish("comentarios", function () {
    return Comentarios.find({});
  });
}


Meteor.methods({
  "publicacion.insert" (publicacion, ownerName) {
    check(publicacion, Object);
    check(ownerName, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Publicaciones.insert({
      titulo: publicacion.titulo,
      autores: publicacion.autores,
      editorial: publicacion.editorial,
      genero: publicacion.genero,
      edicion: publicacion.edicion,
      isbn: publicacion.isbn,
      estado: publicacion.estado,
      para: publicacion.para,
      valorVenta: publicacion.valorVenta,
      nota: 0,
      comentarios: [],
      addedAt: new Date(),
      ownerId: this.userId,
      ownerName: ownerName
    });
  },
  "comentario.update" (idPublicacion, comentarios, nota) {
    check(comentarios, Array);
    check(idPublicacion, String);
    check(nota, Number);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Publicaciones.update(idPublicacion, { $set: { nota: nota, comentarios: comentarios } });
  },
  "publicacion.remove" (idPublicacion) {
    check(idPublicacion, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Publicaciones.remove(idPublicacion);
  },

  "comentario.insert" (text, idPublicacion, ownerName) {
    check(text, String);
    check(idPublicacion, String);
    check(ownerName, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Comentarios.insert({
      text,
      idPublicacion,
      ownerId: this.userId,
      ownerName: ownerName
    });
  }
});