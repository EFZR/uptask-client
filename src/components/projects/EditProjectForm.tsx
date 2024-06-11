import { Link, useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import type { ProjectFormData } from "types";
import { updateProject } from "@/services/Projects";
import { toast } from "react-toastify";

type ProjectFormProps = {
  data: ProjectFormData;
};

export default function EditProjectForm({ data }: ProjectFormProps) {
  const initialValues: ProjectFormData = {
    projectName: data.projectName,
    clientName: data.clientName,
    description: data.description,
    tasks: data.tasks,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({ defaultValues: initialValues });

  const params = useParams();
  const projectId = params.projectId!;

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateProject,

    onError: (error) => {
      toast.error(error.message);
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["editProject", projectId] });
      toast.success(data);
      navigate("/");
    },
  });

  const handleForm = (formData: ProjectFormData) =>
    mutate({ ...formData, _id: projectId });

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-black">Editar Proyecto</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          Llena el siguiente formulario para editar el proyecto.
        </p>

        <nav className="my-5">
          <Link
            to="/"
            className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
          >
            Volver a Projectos
          </Link>
        </nav>

        <form
          className="mt-10 bg-white shadow-lg p-10 rounded-lg"
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          <div className="mb-5 space-y-3">
            <label
              htmlFor="projectName"
              className="text-sm uppercase font-bold"
            >
              Nombre del Proyecto
            </label>
            <input
              id="projectName"
              className="w-full p-3  border border-gray-200"
              type="text"
              placeholder="Nombre del Proyecto"
              {...register("projectName", {
                required: "El Titulo del Proyecto es obligatorio",
              })}
            />

            {errors.projectName && (
              <ErrorMessage>{errors.projectName.message}</ErrorMessage>
            )}
          </div>

          <div className="mb-5 space-y-3">
            <label htmlFor="clientName" className="text-sm uppercase font-bold">
              Nombre Cliente
            </label>
            <input
              id="clientName"
              className="w-full p-3  border border-gray-200"
              type="text"
              placeholder="Nombre del Cliente"
              {...register("clientName", {
                required: "El Nombre del Cliente es obligatorio",
              })}
            />

            {errors.clientName && (
              <ErrorMessage>{errors.clientName.message}</ErrorMessage>
            )}
          </div>

          <div className="mb-5 space-y-3">
            <label
              htmlFor="description"
              className="text-sm uppercase font-bold"
            >
              Descripción
            </label>
            <textarea
              id="description"
              className="w-full p-3  border border-gray-200"
              placeholder="Descripción del Proyecto"
              {...register("description", {
                required: "Una descripción del proyecto es obligatoria",
              })}
            />

            {errors.description && (
              <ErrorMessage>{errors.description.message}</ErrorMessage>
            )}
          </div>
          <input
            type="submit"
            value="Guardar Cambios"
            className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 uppercase font-bold cursor-pointer transition-colors text-white"
          />
        </form>
      </div>
    </>
  );
}
