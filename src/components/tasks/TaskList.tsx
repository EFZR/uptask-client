import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatus } from "@/services/Tasks";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { statusTranslations } from "@/locales/es";
import { Project, TaskProject, TaskStatus } from "@/types/index";
import TaskCard from "./TaskCard";
import DropTask from "./DropTask";

type TaskListProps = {
  tasks: TaskProject[];
  isManager: boolean;
};

type GroupedTasks = {
  [key: string]: TaskProject[];
};

const initialStatusGroups: GroupedTasks = {
  pending: [],
  onHold: [],
  inProgress: [],
  underReview: [],
  completed: [],
};

const statusColors: { [key: string]: string } = {
  pending: "border-t-slate-500",
  onHold: "border-t-red-500",
  inProgress: "border-t-blue-500",
  underReview: "border-t-amber-500",
  completed: "border-t-emerald-500",
};

export default function TaskList({ tasks, isManager }: TaskListProps) {
  const groupedTasks = tasks.reduce((acc, task) => {
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
    currentGroup = [...currentGroup, task];
    return { ...acc, [task.status]: currentGroup };
  }, initialStatusGroups);

  //#region States

  /** Id del projecto */
  const params = useParams();
  const projectId = params.projectId!;

  /** Actualización del estado de la tarea */

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateStatus,

    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({
        queryKey: ["currentProject", projectId],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  //#endregion

  //#region Functions

  function handleDragEnd(e: DragEndEvent) {
    const { over, active } = e;

    if (over && over.id) {
      const taskId = active.id.toString();
      const status = over.id as TaskStatus;
      mutate({ projectId, taskId, status });
      queryClient.setQueryData(
        ["currentProject", projectId],
        (prevData: Project) => {
          const updatedTasks = prevData.tasks.map((task) => {
            if (task._id === taskId) {
              return {
                ...task,
                status,
              };
            }

            return task;
          });
          return {
            ...prevData,
            tasks: updatedTasks,
          };
        }
      );
    }
  }

  //#endregion

  return (
    <>
      <h2 className="text-5xl font-black my-10">Tareas</h2>

      <div className="flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32">
        <DndContext onDragEnd={handleDragEnd}>
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div key={status} className="min-w-[300px] 2xl:min-w-0 2xl:w-1/5">
              <h3
                className={`capitalize text-xl font-light border border-slate-300 bg-white p-3 border-t-8 ${statusColors[status]}`}
              >
                {statusTranslations[status]}
              </h3>
              <DropTask status={status} />
              <ul className="mt-5 space-y-5">
                {tasks.length === 0 ? (
                  <li className="text-gray-500 text-center pt-3">
                    No Hay tareas
                  </li>
                ) : (
                  tasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      isManager={isManager}
                    />
                  ))
                )}
              </ul>
            </div>
          ))}
        </DndContext>
      </div>
    </>
  );
}
