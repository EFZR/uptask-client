import { useForm } from "react-hook-form";
import { NoteFormData } from "@/types/index";
import ErrorMessage from "../ErrorMessage";

export default function AddNotesForm() {
  const initialValues: NoteFormData = {
    content: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  function handleAddNote(formData: NoteFormData) {
    console.log(formData);
  }

  return (
    <form
      onSubmit={handleSubmit(handleAddNote)}
      className="space-y-3"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="content">
          Crear Nota
        </label>
        <input
          type="text"
          id="content"
          placeholder="Contenido de la nota"
          className="w-full p-3 border border-gray-300"
          {...register("content", {
            required: "El contenido de la nota es obligatorio.",
          })}
        />
        {errors.content && (
          <ErrorMessage>{errors.content.message}</ErrorMessage>
        )}
      </div>
      <input
        type="submit"
        value="Crear Nota"
        className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 text-white font-black cursor-pointer"
      />
    </form>
  );
}
