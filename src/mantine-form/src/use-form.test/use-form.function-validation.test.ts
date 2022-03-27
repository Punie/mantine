import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from '../index';

describe('@mantine/form/use-form function validation', () => {
  it('validates all fields with validate handler', async () => {
    const hook = renderHook(() =>
      useForm({
        initialValues: {
          banana: '',
          orange: '',
        },

        validate: (values) => ({
          banana: values.banana !== 'test-banana' ? 'invalid banana' : null,
          orange: values.orange !== 'test-orange' ? 'invalid orange' : null,
        }),
      })
    );

    expect(hook.result.current.errors).toStrictEqual({});

    await act(async () => {
      const result = await hook.result.current.validate();
      expect(result).toStrictEqual({
        hasErrors: true,
        errors: {
          banana: 'invalid banana',
          orange: 'invalid orange',
        },
      });
    });

    expect(hook.result.current.errors).toStrictEqual({
      banana: 'invalid banana',
      orange: 'invalid orange',
    });

    act(() => hook.result.current.setFieldValue('banana', 'test-banana'));
    await act(async () => {
      const result = await hook.result.current.validate();
      expect(result).toStrictEqual({
        hasErrors: true,
        errors: { orange: 'invalid orange' },
      });
    });

    expect(hook.result.current.errors).toStrictEqual({ orange: 'invalid orange' });

    act(() => hook.result.current.setFieldValue('orange', 'test-orange'));
    await act(async () => {
      const result = await hook.result.current.validate();
      expect(result).toStrictEqual({ hasErrors: false, errors: {} });
    });

    expect(hook.result.current.errors).toStrictEqual({});
  });

  it('validates single field with validateField handler', async () => {
    const hook = renderHook(() =>
      useForm({
        initialValues: {
          banana: '',
          orange: '',
        },

        validate: (values) => ({
          banana: values.banana !== 'test-banana' ? 'invalid banana' : null,
          orange: values.orange !== 'test-orange' ? 'invalid orange' : null,
        }),
      })
    );

    await act(async () => {
      const result = await hook.result.current.validateField('banana');
      expect(result).toStrictEqual({ hasError: true, error: 'invalid banana' });
    });

    expect(hook.result.current.errors).toStrictEqual({ banana: 'invalid banana' });

    act(() => hook.result.current.setFieldValue('banana', 'test-banana'));
    await act(async () => {
      const result = await hook.result.current.validateField('banana');
      expect(result).toStrictEqual({ hasError: false, error: null });
    });

    expect(hook.result.current.errors).toStrictEqual({});
  });
});
