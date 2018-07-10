import assertRevert from '../../helpers/assertRevert';

const RBACOwnable = artifacts.require('RBACOwnable');

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('RBAC', function ([_, owner, newOwner, notOwner]) {
  before(async function () {
    this.ownable = await RBACOwnable.new({ from: owner });
    this.roleOwner = await this.ownable.ROLE_OWNER();
  });

  it('should not allow notOwner to add or remove owners', async function () {
    await assertRevert(
      this.ownable.addOwner(newOwner, { from: notOwner })
    );

    await assertRevert(
      this.ownable.removeOwner(owner, { from: notOwner })
    );
  });

  it('should allow existing owner to add and remove a newOwner', async function () {
    await this.ownable.addOwner(newOwner, { from: owner });
    let hasRole = await this.ownable.hasRole(newOwner, this.roleOwner);
    hasRole.should.eq(true);

    await this.ownable.removeOwner(newOwner, { from: owner });
    hasRole = await this.ownable.hasRole(newOwner, this.roleOwner);
    hasRole.should.eq(false);
  });
});
