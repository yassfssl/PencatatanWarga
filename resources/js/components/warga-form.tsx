import { useEffect } from 'react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

type UserOption = { id: number; name: string; email: string; role: string };

type WargaFormValues = {
  nik: string;
  nama_lengkap: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan' | '';
  tempat_lahir: string;
  tanggal_lahir: string;
  agama: 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu' | '';
  pendidikan?: string;
  pekerjaan?: string;
  status_perkawinan: 'Belum Menikah' | 'Menikah' | 'Cerai Hidup' | 'Cerai Mati' | '';
  alamat: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  kode_pos?: string;
  no_telepon?: string;
  user_id?: string | number | null;
};

type Props = {
  data: WargaFormValues;
  setData: (field: keyof WargaFormValues, value: any) => void;
  errors: Partial<Record<keyof WargaFormValues, string>> & { [k: string]: string };
  users?: UserOption[];
};

export default function WargaForm({ data, setData, errors, users }: Props) {
  useEffect(() => {
    // no-op placeholder to satisfy linter in some setups
  }, []);

  const selectedUserId = data.user_id ? String(data.user_id) : 'none';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {users && (
        <div className="md:col-span-2">
          <Label>User Pengguna (Opsional)</Label>
          <Select value={selectedUserId} onValueChange={(v) => setData('user_id', v === 'none' ? null : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Hubungkan dengan akun pengguna" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Tidak Terhubung</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={String(user.id)}>
                  {user.name} — {user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.user_id && <p className="text-red-500 text-sm mt-1">{errors.user_id}</p>}
        </div>
      )}
      <div>
        <Label htmlFor="nik">NIK</Label>
        <Input id="nik" value={data.nik} onChange={(e) => setData('nik', e.target.value)} />
        {errors.nik && <p className="text-red-500 text-sm mt-1">{errors.nik}</p>}
      </div>
      <div>
        <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
        <Input id="nama_lengkap" value={data.nama_lengkap} onChange={(e) => setData('nama_lengkap', e.target.value)} />
        {errors.nama_lengkap && <p className="text-red-500 text-sm mt-1">{errors.nama_lengkap}</p>}
      </div>
      <div>
        <Label>Jenis Kelamin</Label>
        <Select value={data.jenis_kelamin} onValueChange={(v) => setData('jenis_kelamin', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih jenis kelamin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Laki-laki">Laki-laki</SelectItem>
            <SelectItem value="Perempuan">Perempuan</SelectItem>
          </SelectContent>
        </Select>
        {errors.jenis_kelamin && <p className="text-red-500 text-sm mt-1">{errors.jenis_kelamin}</p>}
      </div>
      <div>
        <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
        <Input id="tempat_lahir" value={data.tempat_lahir} onChange={(e) => setData('tempat_lahir', e.target.value)} />
        {errors.tempat_lahir && <p className="text-red-500 text-sm mt-1">{errors.tempat_lahir}</p>}
      </div>
      <div>
        <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
        <Input id="tanggal_lahir" type="date" value={data.tanggal_lahir} onChange={(e) => setData('tanggal_lahir', e.target.value)} />
        {errors.tanggal_lahir && <p className="text-red-500 text-sm mt-1">{errors.tanggal_lahir}</p>}
      </div>
      <div>
        <Label>Agama</Label>
        <Select value={data.agama} onValueChange={(v) => setData('agama', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih agama" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Islam">Islam</SelectItem>
            <SelectItem value="Kristen">Kristen</SelectItem>
            <SelectItem value="Katolik">Katolik</SelectItem>
            <SelectItem value="Hindu">Hindu</SelectItem>
            <SelectItem value="Buddha">Buddha</SelectItem>
            <SelectItem value="Konghucu">Konghucu</SelectItem>
          </SelectContent>
        </Select>
        {errors.agama && <p className="text-red-500 text-sm mt-1">{errors.agama}</p>}
      </div>
      <div>
        <Label htmlFor="pendidikan">Pendidikan</Label>
        <Input id="pendidikan" value={data.pendidikan || ''} onChange={(e) => setData('pendidikan', e.target.value)} />
        {errors.pendidikan && <p className="text-red-500 text-sm mt-1">{errors.pendidikan}</p>}
      </div>
      <div>
        <Label htmlFor="pekerjaan">Pekerjaan</Label>
        <Input id="pekerjaan" value={data.pekerjaan || ''} onChange={(e) => setData('pekerjaan', e.target.value)} />
        {errors.pekerjaan && <p className="text-red-500 text-sm mt-1">{errors.pekerjaan}</p>}
      </div>
      <div>
        <Label>Status Perkawinan</Label>
        <Select value={data.status_perkawinan} onValueChange={(v) => setData('status_perkawinan', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Belum Menikah">Belum Menikah</SelectItem>
            <SelectItem value="Menikah">Menikah</SelectItem>
            <SelectItem value="Cerai Hidup">Cerai Hidup</SelectItem>
            <SelectItem value="Cerai Mati">Cerai Mati</SelectItem>
          </SelectContent>
        </Select>
        {errors.status_perkawinan && <p className="text-red-500 text-sm mt-1">{errors.status_perkawinan}</p>}
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="alamat">Alamat</Label>
        <Input id="alamat" value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} />
        {errors.alamat && <p className="text-red-500 text-sm mt-1">{errors.alamat}</p>}
      </div>
      <div>
        <Label htmlFor="rt">RT</Label>
        <Input id="rt" value={data.rt} onChange={(e) => setData('rt', e.target.value)} />
        {errors.rt && <p className="text-red-500 text-sm mt-1">{errors.rt}</p>}
      </div>
      <div>
        <Label htmlFor="rw">RW</Label>
        <Input id="rw" value={data.rw} onChange={(e) => setData('rw', e.target.value)} />
        {errors.rw && <p className="text-red-500 text-sm mt-1">{errors.rw}</p>}
      </div>
      <div>
        <Label htmlFor="kelurahan">Kelurahan</Label>
        <Input id="kelurahan" value={data.kelurahan} onChange={(e) => setData('kelurahan', e.target.value)} />
        {errors.kelurahan && <p className="text-red-500 text-sm mt-1">{errors.kelurahan}</p>}
      </div>
      <div>
        <Label htmlFor="kecamatan">Kecamatan</Label>
        <Input id="kecamatan" value={data.kecamatan} onChange={(e) => setData('kecamatan', e.target.value)} />
        {errors.kecamatan && <p className="text-red-500 text-sm mt-1">{errors.kecamatan}</p>}
      </div>
      <div>
        <Label htmlFor="kota">Kota</Label>
        <Input id="kota" value={data.kota} onChange={(e) => setData('kota', e.target.value)} />
        {errors.kota && <p className="text-red-500 text-sm mt-1">{errors.kota}</p>}
      </div>
      <div>
        <Label htmlFor="provinsi">Provinsi</Label>
        <Input id="provinsi" value={data.provinsi} onChange={(e) => setData('provinsi', e.target.value)} />
        {errors.provinsi && <p className="text-red-500 text-sm mt-1">{errors.provinsi}</p>}
      </div>
      <div>
        <Label htmlFor="kode_pos">Kode Pos</Label>
        <Input id="kode_pos" value={data.kode_pos || ''} onChange={(e) => setData('kode_pos', e.target.value)} />
        {errors.kode_pos && <p className="text-red-500 text-sm mt-1">{errors.kode_pos}</p>}
      </div>
      <div>
        <Label htmlFor="no_telepon">No. Telepon</Label>
        <Input id="no_telepon" value={data.no_telepon || ''} onChange={(e) => setData('no_telepon', e.target.value)} />
        {errors.no_telepon && <p className="text-red-500 text-sm mt-1">{errors.no_telepon}</p>}
      </div>
    </div>
  );
}


