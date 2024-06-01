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
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import DeleteIcon from '@mui/icons-material/Delete'

import { FormBox, PrimaryTypography, SecondaryTypography } from '../utils/custom/elements'
import { mockData } from '../utils/data'

const validationSchema = yup.object().shape({
  senderAddress: yup.object().shape({
    street: yup.string().required('Street Address is required'),
    city: yup.string().required('City is required'),
    postCode: yup.string().required('Postal Code is required'),
    country: yup.string().required('Country is required')
  }),

  clientAddress: yup.object().shape({
    street: yup.string().required('Street Address is required'),
    city: yup.string().required('City is required'),
    postCode: yup.string().required('Postal Code is required'),
    country: yup.string().required('Country is required')
  }),

  clientName: yup.string().required('Client Name is required'),
  clientEmail: yup.string().email('Invalid email').required('Client Email is required'),
  invoiceDate: yup.string().required('Invoice Date is required'),
  paymentDue: yup.string().required('Payment Due Date is required'),
  projectDescription: yup.string().required('Project Description is required'),

  items: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Item Name is required'),
      quantity: yup.number().positive().integer().required('Quantity is required'),
      price: yup.number().positive().required('Price is required'),
      total: yup.number().positive().required('Total is required')
    })
  )
})

export default function Form({ isNew, invoiceId: id }: { isNew: boolean; invoiceId: string }) {
  const data = mockData.find((d) => d.id === id)!

  const theme = useTheme()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: isNew
      ? {}
      : {
          senderAddress: {
            street: data.senderAddress.street,
            city: data.senderAddress.city,
            postCode: data.senderAddress.postCode,
            country: data.senderAddress.country
          },
          clientAddress: {
            street: data.clientAddress.street,
            city: data.clientAddress.city,
            postCode: data.clientAddress.postCode,
            country: data.clientAddress.country
          },
          clientName: data.clientName,
          clientEmail: data.clientEmail,
          invoiceDate: data.createdAt,
          paymentDue: data.paymentDue,
          projectDescription: data.description,
          items: data.items
        }
  })

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'items'
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    console.log(data)
  }

  const FormInput = styled(TextField)`
    border-radius: 4px;
    ${theme.palette.mode === 'dark' ? 'background-color: #1E2139;' : 'background-color: #fff;'}
    ${theme.palette.mode === 'dark' ? 'color: #ffffff;' : 'color: #0c0e16;'}
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

  return (
    <FormControl
      sx={{
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
        p: '2rem',
        background: `${theme.palette.mode === 'dark' ? '#111' : '#f9fafe'}`,
        scrollbarWidth: 'none'
      }}
      component='form'
      onSubmit={handleSubmit(onSubmit)}
    >
      <PrimaryTypography>
        {isNew && 'New Invoice'}
        {isNew ? '' : ` #${id}`}
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
              name='invoiceDate'
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  type='date'
                  error={!!errors.invoiceDate}
                  helperText={errors.invoiceDate?.message}
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
                      color: `${theme.palette.mode === 'dark' ? '#7E88C3' : '#888EB0'}`
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
