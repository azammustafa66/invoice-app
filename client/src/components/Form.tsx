import {
  Box,
  styled,
  TextField,
  useTheme,
  Grid,
  FormControl,
  Button,
  IconButton,
  Typography
} from '@mui/material'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import DeleteIcon from '@mui/icons-material/Delete'
import { format } from 'date-fns'

import { invoiceValidationSchema } from '../utils/validationSchemas'
import { FormBox, PrimaryTypography, SecondaryTypography } from '../utils/custom/elements'
import { useStore } from '../zustand/store'
import { Invoice } from '../utils/types'
import axiosConfig from '../utils/axiosConfig'

export default function Form({ invoice }: { invoice: Invoice | object }) {
  const { isNewInvoice: isNew } = useStore()

  const theme = useTheme().palette.mode
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(invoiceValidationSchema),
    defaultValues: isNew
      ? {}
      : {
          senderAddress: {
            street: (invoice as Invoice).senderAddress.street,
            city: (invoice as Invoice).senderAddress.city,
            postCode: (invoice as Invoice).senderAddress.postCode,
            country: (invoice as Invoice).senderAddress.country
          },
          clientAddress: {
            street: (invoice as Invoice).clientAddress.street,
            city: (invoice as Invoice).clientAddress.city,
            postCode: (invoice as Invoice).clientAddress.postCode,
            country: (invoice as Invoice).clientAddress.country
          },
          clientName: (invoice as Invoice).client.name,
          clientEmail: (invoice as Invoice).client.email,
          createdAt: format((invoice as Invoice).createdAt, 'dd MMM yyyy'),
          paymentDue: format((invoice as Invoice).paymentDue, 'dd MMM yyyy'),
          items: (invoice as Invoice).invoiceItems
        }
  })

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'items'
  })

  const FormInput = styled(TextField)`
    border-radius: 4px;
    ${theme === 'dark' ? 'background-color: #1E2139;' : 'background-color: #fff;'}
    ${theme === 'dark' ? 'color: #ffffff;' : 'color: #0c0e16;'}
    font-size: 15px;
    font-style: normal;
    font-weight: 700;
    line-height: 18px;
    letter-spacing: -0.1px;
    width: 100%;
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    &[type='number'] {
      -moz-appearance: textfield;
    }
  `
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      isNew
        ? await axiosConfig.post('/invoices', data)
        : await axiosConfig.put(`/invoices/${(invoice as Invoice)._id}`, data)
    } catch {
      console.error('An error occurred while submitting the form')
    }
  }

  return (
    <FormControl
      sx={{
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
        p: '2rem',
        background: `${theme === 'dark' ? '#111' : '#f9fafe'}`,
        scrollbarWidth: 'none'
      }}
      component='form'
      onSubmit={handleSubmit(onSubmit)}
    >
      <PrimaryTypography>
        {isNew && 'New Invoice'}
        {isNew ? '' : ` #${(invoice as Invoice)._id}`}
      </PrimaryTypography>

      <FormBox>
        <SecondaryTypography color={'#7C5DFA'}>Bill from</SecondaryTypography>

        <Controller
          name='senderAddress.street'
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              label='Street Address'
              error={!!errors.senderAddress?.street}
              helperText={errors.senderAddress?.street?.message}
            />
          )}
        />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Controller
              name='senderAddress.city'
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  label='City'
                  error={!!errors.senderAddress?.city}
                  helperText={errors.senderAddress?.city?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller
              name='senderAddress.postCode'
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  label='Postal Code'
                  error={!!errors.senderAddress?.postCode}
                  helperText={errors.senderAddress?.postCode?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller
              name='senderAddress.country'
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  label='Country'
                  error={!!errors.senderAddress?.country}
                  helperText={errors.senderAddress?.country?.message}
                />
              )}
            />
          </Grid>
        </Grid>

        <FormBox>
          <SecondaryTypography color={'#7C5DFA'}>Bill to</SecondaryTypography>

          <Controller
            name='clientName'
            control={control}
            render={({ field }) => (
              <FormInput
                {...field}
                label='Client Name'
                error={!!errors.clientName}
                helperText={errors.clientName?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name='clientEmail'
            control={control}
            render={({ field }) => (
              <FormInput
                {...field}
                label='Client Email'
                error={!!errors.clientEmail}
                helperText={errors.clientEmail?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name='clientAddress.street'
            control={control}
            render={({ field }) => (
              <FormInput
                {...field}
                label='Street Address'
                error={!!errors.clientAddress?.street}
                helperText={errors.clientAddress?.street?.message}
                fullWidth
              />
            )}
          />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Controller
                name='clientAddress.city'
                control={control}
                render={({ field }) => (
                  <FormInput
                    {...field}
                    label='City'
                    error={!!errors.clientAddress?.city}
                    helperText={errors.clientAddress?.city?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name='clientAddress.postCode'
                control={control}
                render={({ field }) => (
                  <FormInput
                    {...field}
                    label='Postal Code'
                    error={!!errors.clientAddress?.postCode}
                    helperText={errors.clientAddress?.postCode?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name='clientAddress.country'
                control={control}
                render={({ field }) => (
                  <FormInput
                    {...field}
                    label='Country'
                    error={!!errors.clientAddress?.country}
                    helperText={errors.clientAddress?.country?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </FormBox>

        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                color: '#7C5DFA',
                fontSize: '15px',
                fontWeight: 700,
                lineHeight: '18px',
                letterSpacing: '-0.1px',
                marginBottom: '5px' // Adjust as needed
              }}
            >
              Invoice Date
            </Typography>
            <Controller
              name='createdAt'
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  type='date'
                  error={!!errors.createdAt}
                  helperText={errors.createdAt?.message}
                  sx={{
                    ':focus': { cursor: 'text' }
                  }}
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                color: '#7C5DFA',
                fontSize: '15px',
                fontWeight: 700,
                lineHeight: '18px',
                letterSpacing: '-0.1px',
                marginBottom: '5px'
              }}
            >
              Payment Due
            </Typography>
            <Controller
              name='paymentDue'
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  type='date'
                  error={!!errors.paymentDue}
                  helperText={errors.paymentDue?.message}
                  fullWidth
                />
              )}
            />
          </Grid>
        </Grid>

        <Controller
          name='projectDescription'
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              label='Project Description'
              error={!!errors.projectDescription}
              helperText={errors.projectDescription?.message}
              fullWidth
            />
          )}
        />

        <FormBox>
          <PrimaryTypography color='#777F98' fontWeight={700} lineHeight='32px'>
            Item List
          </PrimaryTypography>

          <FormBox>
            {fields.map((item, index) => (
              <Box key={item.id} sx={{ display: 'flex', flexDirection: 'row', gap: '1.5rem' }}>
                {/* Item Name */}
                <Controller
                  name={`items.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      {...field}
                      label='Item Name'
                      error={!!errors.items?.[index]?.name}
                      helperText={errors.items?.[index]?.name?.message}
                    />
                  )}
                />

                {/* Quantity */}
                <Controller
                  name={`items.${index}.quantity`}
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      {...field}
                      label='Quantity'
                      type='number'
                      error={!!errors.items?.[index]?.quantity}
                      helperText={errors.items?.[index]?.quantity?.message}
                    />
                  )}
                />

                {/* Price */}
                <Controller
                  name={`items.${index}.price`}
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      {...field}
                      label='Price'
                      type='number'
                      error={!!errors.items?.[index]?.price}
                      helperText={errors.items?.[index]?.price?.message}
                    />
                  )}
                />

                {/* Total */}
                <Controller
                  name={`items.${index}.total`}
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      {...field}
                      label='Total'
                      type='number'
                      error={!!errors.items?.[index]?.total}
                      helperText={errors.items?.[index]?.total?.message}
                    />
                  )}
                />

                {/* Remove Item */}
                <IconButton onClick={() => remove(index)}>
                  <DeleteIcon
                    sx={{
                      cursor: 'pointer',
                      alignSelf: 'center',
                      color: `${theme === 'dark' ? '#7E88C3' : '#888EB0'}`
                    }}
                  />
                </IconButton>
              </Box>
            ))}
          </FormBox>
          {/* Add Item */}
          <PrimaryTypography
            onClick={() => {
              append({ name: '', quantity: 0, price: 0, total: 0 })
            }}
            sx={{ color: '#7C5DFA', cursor: 'pointer', alignSelf: 'flex-start' }}
          >
            + Add New Item
          </PrimaryTypography>
        </FormBox>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between'
          }}
        >
          {/* Left-aligned buttons */}
          {isNew && (
            <Button
              type='submit'
              variant='contained'
              color='primary'
              sx={{ width: '25%', height: '48px', borderRadius: '8px', textTransform: 'none' }}
            >
              Discard
            </Button>
          )}

          {/* Right-aligned buttons */}
          <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {isNew ? (
              <>
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  sx={{
                    flex: '1',
                    width: '50%',
                    height: '48px',
                    borderRadius: '8px',
                    textTransform: 'none'
                  }}
                >
                  Save as Draft
                </Button>
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  sx={{
                    flex: '1',
                    width: '50%',
                    height: '48px',
                    borderRadius: '8px',
                    textTransform: 'none'
                  }}
                >
                  Save & Send
                </Button>
              </>
            ) : (
              <>
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  sx={{ flex: '1', height: '48px', borderRadius: '8px', textTransform: 'none' }}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  sx={{ flex: '1', height: '48px', borderRadius: '8px', textTransform: 'none' }}
                >
                  Save & Send
                </Button>
              </>
            )}
          </Box>
        </Box>
      </FormBox>
    </FormControl>
  )
}
