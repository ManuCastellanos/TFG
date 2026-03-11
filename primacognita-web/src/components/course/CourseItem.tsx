interface CourseProps {
  item: Course;
}

export const CourseItem = ({ item }: CourseProps) => {
  const { fullname } = item;
  return (
    <div className="bg-amber-700 rounded-2xl">
      <p>{fullname}</p>
    </div>
  );
};
