import React, { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { ROLE_STYLES, ROLE_DASHBOARD_PATHS } from '../../constants';
import { Role, PracticeStudent } from '../../types';

const ROLE_MESSAGES: Record<string, { title: string, message: string }> = {
    STUDENT: {
        title: "Panel de Estudiante",
        message: "Aquí puedes visualizar tus cursos, materiales y entregas pendientes. ¡Mucho éxito en tus estudios!"
    },
    TEACHER: {
        title: "Panel de Profesor",
        message: "Gestiona tus cursos, califica tareas y comunícate con tus estudiantes desde este panel central."
    },
    MANAGER: {
        title: "Panel de Manager",
        message: "Supervisa el progreso general, gestiona recursos y obtén reportes clave para la toma de decisiones."
    }
}

const GenericDashboard: React.FC = () => {
  const { currentUser, activeRole } = useAuth();
  const { classrooms } = useData(); // Global data to check classroom enrollment

  const practiceContext = useMemo(() => {
      if (activeRole !== Role.STUDENT || !currentUser) return null;
      const myClassroom = classrooms.find(c => c.students.some(s => s.id === currentUser.id));
      if (!myClassroom) return null;

      const practiceStudent = myClassroom.students.find(s => s.id === currentUser.id) as PracticeStudent;
      return {
          classroomName: myClassroom.name,
          simulatedRole: practiceStudent.simulatedRole,
      };
  }, [currentUser, activeRole, classrooms]);


  if (!currentUser || !activeRole) {
    return <div>Cargando...</div>;
  }

  const roleStyle = ROLE_STYLES[activeRole];
  const roleContent = ROLE_MESSAGES[activeRole] || { title: "Panel Principal", message: "Bienvenido a tu panel de control." };

  return (
    <div className="space-y-8">
      <div className={`rounded-xl text-white bg-gradient-to-r ${roleStyle.gradient} shadow-lg overflow-hidden`}>
        <div className="h-1.5 bg-white/30"></div>
        <div className="p-8">
            <h1 className="text-4xl font-bold">¡Bienvenido, {currentUser.name}!</h1>
            {practiceContext ? (
                <p className="mt-2 text-lg opacity-90">
                    Estás en el aula de práctica <strong>"{practiceContext.classroomName}"</strong>. Tu rol simulado es: <strong>{practiceContext.simulatedRole}</strong>.
                </p>
            ) : (
                 <p className="mt-2 text-lg opacity-90">{roleContent.message}</p>
            )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="h-1.5 bg-indigo-500"></div>
        <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{roleContent.title}</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Esta es tu área principal. Las funcionalidades específicas de tu rol aparecerán aquí.
            </p>
            {/* Placeholder for future content */}
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <p className="text-gray-500 italic">Contenido futuro...</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GenericDashboard;
