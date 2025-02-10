import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DeviceCard from './DeviceCard';

const SortableItem = ({ device, toggleDevice, updateDeviceSetting }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: device.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform) || undefined,
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="h-full">
      {/* Separate Drag Handle to prevent unwanted dragging */}
      <div {...attributes} {...listeners} className="cursor-move">
        <DeviceCard device={device} toggleDevice={toggleDevice} updateDeviceSetting={updateDeviceSetting} />
      </div>
    </div>
  );
};

export default SortableItem;
