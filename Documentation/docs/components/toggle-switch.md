# ToggleSwitch

## Component

The `ToggleSwitch` component is a reusable component that renders a toggle switch with a customizable text label. It allows users to toggle a boolean value on or off.

## File Path

The `ToggleSwitch` component is located at the following path:
<br>
`path/to/your/component/ToggleSwitch.tsx`

## Props

The `ToggleSwitch` component accepts the following props:

| Prop           | Type      | Default | Description                                          |
| -------------- | --------- | ------- | ---------------------------------------------------- |
| `text`         | `string`  |         | The text label to display next to the toggle switch. |
| `initialValue` | `boolean` | `false` | The initial value of the toggle switch.              |

## Usage

To use the `ToggleSwitch` component, import it into your React component and include it with the desired props:

```tsx
import ToggleSwitch from './ToggleSwitch';

const MyComponent = () => {
  return (
    <div>
      <ToggleSwitch text='Toggle me' initialValue={false} />
    </div>
  );
};

export default MyComponent;
```

## Functionality

The `ToggleSwitch` component uses the `useState` hook to manage the checked state of the toggle switch. The initial state is determined by the `initialValue` prop.

When the toggle switch is clicked, the `handleToggle` function is called, which toggles the `isChecked` state using the `setIsChecked` function. This updates the checked state of the toggle switch.
