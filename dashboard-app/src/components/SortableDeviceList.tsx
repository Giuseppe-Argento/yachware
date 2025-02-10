import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';

const SortableDeviceList = ({ devices, deviceOrder, setDeviceOrder, toggleDevice, updateDeviceSetting }) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return; // Prevents errors when dragging outside the list

    if (active.id !== over.id) {
      const oldIndex = deviceOrder.indexOf(active.id);
      const newIndex = deviceOrder.indexOf(over.id);
      setDeviceOrder(arrayMove(deviceOrder, oldIndex, newIndex));
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={deviceOrder} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deviceOrder.map((id) => {
            const device = devices.find((d) => d.id === id);
            return device ? (
              <SortableItem key={device.id} device={device} toggleDevice={toggleDevice} updateDeviceSetting={updateDeviceSetting} />
            ) : null;
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default SortableDeviceList;
